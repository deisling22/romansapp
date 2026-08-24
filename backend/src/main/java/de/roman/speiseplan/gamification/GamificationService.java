package de.roman.speiseplan.gamification;

import de.roman.speiseplan.gamification.GamificationDtos.AchievementDto;
import de.roman.speiseplan.gamification.GamificationDtos.EventRequest;
import de.roman.speiseplan.gamification.GamificationDtos.FrameDto;
import de.roman.speiseplan.gamification.GamificationDtos.GoalDto;
import de.roman.speiseplan.gamification.GamificationDtos.ProgressDto;
import de.roman.speiseplan.gamification.GamificationDtos.SettingsRequest;
import de.roman.speiseplan.gamification.GamificationDtos.TitleDto;
import de.roman.speiseplan.plan.PlanEntryRepository;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.TemporalAdjusters;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class GamificationService {
    private static final ZoneId ZONE = ZoneId.systemDefault();

    private final GamificationEventRepository eventRepository;
    private final GamificationProfileRepository profileRepository;
    private final PlanEntryRepository planEntryRepository;

    public GamificationService(
            GamificationEventRepository eventRepository,
            GamificationProfileRepository profileRepository,
            PlanEntryRepository planEntryRepository) {
        this.eventRepository = eventRepository;
        this.profileRepository = profileRepository;
        this.planEntryRepository = planEntryRepository;
    }

    @Transactional
    public ProgressDto record(String ownerEmail, List<EventRequest> requests) {
        for (EventRequest request : requests) {
            if (!eventRepository.existsByOwnerEmailAndEventId(ownerEmail, request.eventId())) {
                eventRepository.save(new GamificationEvent(
                        request.eventId(), ownerEmail, request.type(), request.referenceId(), request.occurredAt()));
                deriveCookingEvents(ownerEmail, request);
            }
        }
            awardCompletedGoals(ownerEmail);
        return progress(ownerEmail);
    }

    private void deriveCookingEvents(String ownerEmail, EventRequest request) {
        if (request.type() != GamificationEventType.COOK_DISH || request.referenceId() == null) return;
        boolean firstCook = !eventRepository.existsByOwnerEmailAndEventTypeAndReferenceId(
                ownerEmail, GamificationEventType.TRY_NEW_DISH, request.referenceId());
        if (firstCook) {
            saveDerivedEvent(ownerEmail, request, GamificationEventType.TRY_NEW_DISH, "new-dish");
        }
        try {
            Long dishId = Long.valueOf(request.referenceId());
            if (planEntryRepository.existsByDishIdAndPlanCreatorIsNotNull(dishId)) {
                saveDerivedEvent(ownerEmail, request, GamificationEventType.CREATOR_RECIPE_COOKED, "creator-dish");
            }
        } catch (NumberFormatException ignored) {
            // Local client IDs cannot be linked to a server-side creator plan yet.
        }
    }

    private void saveDerivedEvent(
            String ownerEmail, EventRequest source, GamificationEventType type, String key) {
        String eventId = UUID.nameUUIDFromBytes(
                (ownerEmail + ":" + key + ":" + source.eventId()).getBytes(StandardCharsets.UTF_8)).toString();
        if (!eventRepository.existsByOwnerEmailAndEventId(ownerEmail, eventId)) {
            eventRepository.save(new GamificationEvent(
                    eventId, ownerEmail, type, source.referenceId(), source.occurredAt()));
        }
    }

            private void awardCompletedGoals(String ownerEmail) {
            List<GamificationEvent> events = eventRepository.findByOwnerEmailOrderByOccurredAtAsc(ownerEmail);
            LocalDate now = LocalDate.now(ZONE);
            LocalDate weekStart = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
            String week = weekStart.toString();
            String month = now.getYear() + "-" + now.getMonthValue();
            long cookedToday = countSince(events, GamificationEventType.COOK_DISH, now);
            long cookedThisWeek = referencesSince(events, GamificationEventType.COOK_DISH, weekStart);
            long cookedThisMonth = referencesSince(events, GamificationEventType.COOK_DISH, now.withDayOfMonth(1));
            GamificationProfile profile = profileRepository.findById(ownerEmail)
                .orElseGet(() -> new GamificationProfile(ownerEmail));

            award(ownerEmail, "daily-cook:" + now, GamificationEventType.DAILY_COOK_GOAL, cookedToday >= 1, now);
            award(ownerEmail, "daily-rate:" + now, GamificationEventType.DAILY_RATE_GOAL,
                countSince(events, GamificationEventType.RATE_RECIPE, now) >= 1, now);
            award(ownerEmail, "weekly-cook:" + week, GamificationEventType.WEEKLY_COOK_GOAL,
                cookedThisWeek >= profile.getWeeklyCookTarget(), weekStart);
            award(ownerEmail, "weekly-new:" + week, GamificationEventType.WEEKLY_NEW_RECIPE_GOAL,
                countSince(events, GamificationEventType.TRY_NEW_DISH, weekStart) >= 1, weekStart);
            award(ownerEmail, "weekly-plan:" + week, GamificationEventType.WEEKLY_PLAN_GOAL,
                countSince(events, GamificationEventType.COMPLETE_PLAN, weekStart) >= 1, weekStart);
            award(ownerEmail, "season:" + month, GamificationEventType.SEASONAL_GOAL,
                cookedThisMonth >= 12, now.withDayOfMonth(1));
            award(ownerEmail, "creator", GamificationEventType.CREATOR_GOAL,
                count(events, GamificationEventType.CREATOR_RECIPE_COOKED) >= 3, now);
            award(ownerEmail, "household:" + week, GamificationEventType.HOUSEHOLD_GOAL,
                cookedThisWeek >= profile.getHouseholdWeeklyTarget(), weekStart);
            }

            private void award(
                String ownerEmail, String key, GamificationEventType type, boolean completed, LocalDate occurredOn) {
            if (!completed) return;
            String eventId = UUID.nameUUIDFromBytes((ownerEmail + ":" + key).getBytes(StandardCharsets.UTF_8)).toString();
            if (!eventRepository.existsByOwnerEmailAndEventId(ownerEmail, eventId)) {
                eventRepository.save(new GamificationEvent(
                    eventId, ownerEmail, type, key, occurredOn.atStartOfDay(ZONE).toInstant()));
            }
            }

    @Transactional(readOnly = true)
    public ProgressDto progress(String ownerEmail) {
        List<GamificationEvent> events = eventRepository.findByOwnerEmailOrderByOccurredAtAsc(ownerEmail);
        GamificationProfile profile = profileRepository.findById(ownerEmail)
                .orElseGet(() -> new GamificationProfile(ownerEmail));
        int xp = events.stream().mapToInt(event -> event.getEventType().xp()).sum();
        int level = levelForXp(xp);
        Set<String> cookedReferences = references(events, GamificationEventType.COOK_DISH);
        long cooked = count(events, GamificationEventType.COOK_DISH);
        long completedPlans = count(events, GamificationEventType.COMPLETE_PLAN);
        List<LocalDate> cookingDays = events.stream()
                .filter(event -> event.getEventType() == GamificationEventType.COOK_DISH)
                .map(event -> event.getOccurredAt().atZone(ZONE).toLocalDate())
                .distinct()
                .sorted()
                .toList();
        StreakResult streak = currentStreak(cookingDays);
        int bestStreak = bestStreak(cookingDays);
        LocalDate now = LocalDate.now(ZONE);
        LocalDate weekStart = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        long cookedThisWeek = cookingDays.stream().filter(day -> !day.isBefore(weekStart)).count();
        long cookedThisMonth = cookingDays.stream()
                .filter(day -> day.getYear() == now.getYear() && day.getMonth() == now.getMonth()).count();
            long cookedToday = cookingDays.stream().filter(day -> day.equals(now)).count();

        List<FrameDto> frames = List.of(
                frame("CLASSIC", "Klassisch", 1, level),
                frame("HERB", "Kräutergarten", 2, level),
                frame("EMBER", "Glut & Flamme", 4, level),
                frame("GOLD", "Goldene Küche", 7, level),
                frame("AURORA", "Nordlicht", 10, level));
        String selectedFrame = frames.stream()
                .anyMatch(frame -> frame.id().equals(profile.getSelectedFrame()) && frame.unlocked())
                ? profile.getSelectedFrame() : "CLASSIC";
            List<TitleDto> titles = List.of(
                title("KUECHENSTARTER", "Küchenstarter", 1, level),
                title("GENUSSMENSCH", "Genussmensch", 3, level),
                title("WOCHENPLANER", "Wochenplan-Profi", 5, level),
                title("KUECHENLEGENDE", "Küchenlegende", 9, level));
            String selectedTitle = titles.stream()
                .anyMatch(title -> title.id().equals(profile.getSelectedTitle()) && title.unlocked())
                ? profile.getSelectedTitle() : "KUECHENSTARTER";

        List<AchievementDto> achievements = List.of(
                achievement("FIRST_DISH", "Erste Schritte", "Koche dein erstes Gericht.", cooked, 1),
                achievement("WEEK_COOK", "Wochenkoch", "Koche sieben Gerichte.", cooked, 7),
                achievement("KITCHEN_ROUTINE", "Küchenroutine", "Koche 30 Gerichte.", cooked, 30),
                achievement("EXPLORER", "Entdecker", "Koche zehn unterschiedliche Gerichte.", cookedReferences.size(), 10),
                achievement("PLAN_PRO", "Planungsprofi", "Schließe fünf Wochenpläne ab.", completedPlans, 5),
                achievement("PANTRY_SAVER", "Vorratsretter", "Koche zehnmal aus dem Vorrat.",
                        count(events, GamificationEventType.PANTRY_MEAL), 10),
                achievement("OFFLINE_COOK", "Offline-Koch", "Synchronisiere ein lokal erstelltes Rezept.",
                        count(events, GamificationEventType.OFFLINE_RECIPE_SYNCED), 1),
                achievement("CREATOR_FAN", "Creator-Fan", "Koche drei Creator-Gerichte.",
                        count(events, GamificationEventType.CREATOR_RECIPE_COOKED), 3),
                achievement("OWN_CREATION", "Eigenkreation", "Erstelle fünf eigene Rezepte.",
                        count(events, GamificationEventType.CREATE_RECIPE), 5));

        List<GoalDto> weeklyGoals = List.of(
                goal("WEEKLY_COOK", "Diese Woche kochen", cookedThisWeek, profile.getWeeklyCookTarget(), 50),
                goal("WEEKLY_NEW_RECIPE", "Ein neues Rezept ausprobieren",
                        countSince(events, GamificationEventType.TRY_NEW_DISH, weekStart), 1, 20),
                goal("WEEKLY_PLAN", "Einen Wochenplan abschließen",
                        countSince(events, GamificationEventType.COMPLETE_PLAN, weekStart), 1, 40));
                List<GoalDto> dailyGoals = List.of(
                    goal("DAILY_COOK", "Heute ein Gericht kochen", cookedToday, 1, 15),
                    goal("DAILY_RATE", "Heute ein Rezept bewerten",
                        countSince(events, GamificationEventType.RATE_RECIPE, now), 1, 5));
        return new ProgressDto(
                xp, level, xp - thresholdForLevel(level), thresholdForLevel(level + 1) - thresholdForLevel(level),
                    streak.days(), bestStreak, !streak.shieldUsed(), cooked, cookedReferences.size(), completedPlans,
                    selectedFrame, selectedTitle, frames, titles, achievements, dailyGoals, weeklyGoals,
                goal("SEASON", "Saison-Challenge: Küchenmonat", cookedThisMonth, 12, 120),
                    goal("CREATOR", "Creator-Challenge: Drei neue Favoriten",
                        count(events, GamificationEventType.CREATOR_RECIPE_COOKED), 3, 80),
                goal("HOUSEHOLD", "Gemeinsames Haushaltsziel", cookedThisWeek,
                        profile.getHouseholdWeeklyTarget(), 100));
    }

    @Transactional
    public ProgressDto updateSettings(String ownerEmail, SettingsRequest request) {
        int level = levelForXp(eventRepository.findByOwnerEmailOrderByOccurredAtAsc(ownerEmail).stream()
                .mapToInt(event -> event.getEventType().xp()).sum());
        int requiredLevel = switch (request.selectedFrame()) {
            case "CLASSIC" -> 1;
            case "HERB" -> 2;
            case "EMBER" -> 4;
            case "GOLD" -> 7;
            case "AURORA" -> 10;
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unbekannter Profilrahmen.");
        };
        if (level < requiredLevel) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dieser Profilrahmen ist noch gesperrt.");
        }
        int titleLevel = switch (request.selectedTitle()) {
            case "KUECHENSTARTER" -> 1;
            case "GENUSSMENSCH" -> 3;
            case "WOCHENPLANER" -> 5;
            case "KUECHENLEGENDE" -> 9;
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unbekannter Profiltitel.");
        };
        if (level < titleLevel) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dieser Profiltitel ist noch gesperrt.");
        }
        GamificationProfile profile = profileRepository.findById(ownerEmail)
                .orElseGet(() -> new GamificationProfile(ownerEmail));
        profile.update(request.selectedFrame(), request.selectedTitle(), request.weeklyCookTarget(),
            request.householdWeeklyTarget());
        profileRepository.save(profile);
        return progress(ownerEmail);
    }

    private static long count(List<GamificationEvent> events, GamificationEventType type) {
        return events.stream().filter(event -> event.getEventType() == type).count();
    }

    private static long countSince(List<GamificationEvent> events, GamificationEventType type, LocalDate start) {
        return events.stream().filter(event -> event.getEventType() == type)
                .filter(event -> !event.getOccurredAt().atZone(ZONE).toLocalDate().isBefore(start)).count();
    }

    private static long referencesSince(
            List<GamificationEvent> events, GamificationEventType type, LocalDate start) {
        return events.stream().filter(event -> event.getEventType() == type)
                .filter(event -> !event.getOccurredAt().atZone(ZONE).toLocalDate().isBefore(start))
                .map(event -> event.getReferenceId() == null ? event.getOccurredAt().toString() : event.getReferenceId())
                .distinct().count();
    }

    private static Set<String> references(List<GamificationEvent> events, GamificationEventType type) {
        Set<String> references = new HashSet<>();
        events.stream().filter(event -> event.getEventType() == type)
            .map(event -> event.getReferenceId()).filter(reference -> reference != null).forEach(references::add);
        return references;
    }

    private static StreakResult currentStreak(List<LocalDate> days) {
        if (days.isEmpty()) return new StreakResult(0, false);
        Set<LocalDate> values = new HashSet<>(days);
        LocalDate cursor = LocalDate.now(ZONE);
        if (!values.contains(cursor)) cursor = cursor.minusDays(1);
        int streak = 0;
        boolean shieldUsed = false;
        while (true) {
            if (values.contains(cursor)) {
                streak++;
                cursor = cursor.minusDays(1);
            } else if (!shieldUsed && cursor.getMonth().equals(LocalDate.now(ZONE).getMonth())
                    && values.contains(cursor.minusDays(1))) {
                shieldUsed = true;
                cursor = cursor.minusDays(1);
            } else {
                break;
            }
        }
        return new StreakResult(streak, shieldUsed);
    }

    private static int bestStreak(List<LocalDate> days) {
        if (days.isEmpty()) return 0;
        List<LocalDate> sorted = new ArrayList<>(days);
        sorted.sort(Comparator.naturalOrder());
        int best = 1;
        int current = 1;
        for (int index = 1; index < sorted.size(); index++) {
            current = sorted.get(index - 1).plusDays(1).equals(sorted.get(index)) ? current + 1 : 1;
            best = Math.max(best, current);
        }
        return best;
    }

    private static int levelForXp(int xp) {
        int level = 1;
        while (xp >= thresholdForLevel(level + 1)) level++;
        return level;
    }

    private static int thresholdForLevel(int level) {
        int steps = level - 1;
        return steps * (100 + Math.max(0, steps - 1) * 25);
    }

    private static FrameDto frame(String id, String name, int requiredLevel, int level) {
        return new FrameDto(id, name, requiredLevel, level >= requiredLevel);
    }

    private static TitleDto title(String id, String name, int requiredLevel, int level) {
        return new TitleDto(id, name, requiredLevel, level >= requiredLevel);
    }

    private static AchievementDto achievement(String id, String name, String description, long progress, long target) {
        String tier = progress >= target * 5 ? "GOLD" : progress >= target * 2 ? "SILVER" : progress >= target ? "BRONZE" : "LOCKED";
        return new AchievementDto(id, name, description, tier, progress, target, progress >= target);
    }

    private static GoalDto goal(String id, String name, long progress, long target, int bonusXp) {
        return new GoalDto(id, name, progress, target, bonusXp, progress >= target);
    }

    private record StreakResult(int days, boolean shieldUsed) {
    }
}