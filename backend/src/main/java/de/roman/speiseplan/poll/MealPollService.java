package de.roman.speiseplan.poll;

import de.roman.speiseplan.household.HouseholdContext;
import de.roman.speiseplan.plan.PlanEntry;
import de.roman.speiseplan.plan.PlanEntryRepository;
import de.roman.speiseplan.poll.MealPollDtos.ManagedPoll;
import de.roman.speiseplan.poll.MealPollDtos.Option;
import de.roman.speiseplan.poll.MealPollDtos.PublicPoll;
import de.roman.speiseplan.poll.MealPollDtos.Result;
import de.roman.speiseplan.poll.MealPollDtos.VoteRequest;
import de.roman.speiseplan.poll.MealPollDtos.VoteResult;
import de.roman.speiseplan.schedule.ScheduleService;
import java.text.Normalizer;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class MealPollService {
    private final MealPollRepository polls;
    private final MealPollVoteRepository votes;
    private final ScheduleService schedule;
    private final PlanEntryRepository entries;

    public MealPollService(MealPollRepository polls, MealPollVoteRepository votes,
                           ScheduleService schedule, PlanEntryRepository entries) {
        this.polls = polls;
        this.votes = votes;
        this.schedule = schedule;
        this.entries = entries;
    }

    @Transactional
    public ManagedPoll create(String owner) {
        List<MealPollOption> options = schedule.nextPollEntries().stream().map(MealPollOption::new).toList();
        if (options.size() < 2) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Für eine Abfrage werden mindestens zwei nächste Gerichte benötigt.");
        }
        return managed(polls.save(new MealPoll(owner, HouseholdContext.currentId(), options, Instant.now())));
    }

    @Transactional(readOnly = true)
    public List<ManagedPoll> list(String owner) {
        return polls.findByOwnerEmailAndHouseholdIdAndExpiresAtAfterOrderByCreatedAtDesc(
                owner, HouseholdContext.currentId(), Instant.now()).stream().map(this::managed).toList();
    }

    @Transactional(readOnly = true)
    public PublicPoll publicPoll(String id) {
        return publicDto(require(id, false));
    }

    @Transactional(readOnly = true)
    public ManagedPoll manage(String id, String owner) {
        return managed(owned(id, owner, false));
    }

    @Transactional
    public void vote(String id, VoteRequest request) {
        MealPoll poll = require(id, true);
        if (poll.isClosed()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Diese Abfrage wurde bereits beendet.");
        }
        List<Long> allowed = poll.getOptions().stream().map(MealPollOption::getEntryId).toList();
        if (request.ranking().size() != allowed.size()
                || !new HashSet<>(request.ranking()).equals(new HashSet<>(allowed))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bitte ordne jedes Gericht genau einmal ein.");
        }
        String name = Normalizer.normalize(request.name(), Normalizer.Form.NFKC).strip().replaceAll("\\s+", " ");
        if (name.isBlank() || name.length() > 80 || name.codePoints().anyMatch(Character::isISOControl)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bitte gib einen gültigen Namen an.");
        }
        String key = name.toLowerCase(Locale.ROOT);
        if (key.length() > 80) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bitte verwende einen kürzeren Namen.");
        }
        MealPollVote vote = votes.findByPollIdAndNameKey(id, key).orElseGet(() -> new MealPollVote(poll, key));
        vote.update(name, request.ranking());
        votes.save(vote);
    }

    @Transactional
    public ManagedPoll close(String id, String owner) {
        MealPoll poll = owned(id, owner, true);
        poll.close();
        return managed(poll);
    }

    @Transactional
    public void delete(String id, String owner) {
        polls.delete(owned(id, owner, true));
    }

    @Transactional
    public ManagedPoll apply(String id, String owner, int count) {
        MealPoll poll = owned(id, owner, true);
        ManagedPoll result = managed(poll);
        if (result.voteCount() == 0 || count < 1 || count > result.results().size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bitte wähle eine gültige Anzahl aus einer Abfrage mit Stimmen.");
        }
        List<Long> activePlanIds = schedule.activePlans().stream().map(plan -> plan.getId()).toList();
        List<PlanEntry> selected = new ArrayList<>();
        for (Result ranked : result.results().subList(0, count)) {
            MealPollOption original = poll.getOptions().stream()
                    .filter(option -> option.getEntryId().equals(ranked.option().entryId())).findFirst().orElseThrow();
            PlanEntry entry = entries.findById(original.getEntryId())
                    .filter(candidate -> candidate.getPlan().getHouseholdId() != null
                            && candidate.getPlan().getHouseholdId() == HouseholdContext.currentId()
                            && candidate.getPlan().getCreator() == null
                            && activePlanIds.contains(candidate.getPlan().getId())
                            && candidate.getDish().getId().equals(original.getDishId())
                            && candidate.getMealSlot() == original.getMealSlot())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT,
                            "Ein gewähltes Gericht wurde entfernt oder verändert. Bitte erstelle eine neue Abfrage."));
            selected.add(entry);
        }
        entries.findByPriorityOrderIsNotNull().forEach(entry -> entry.setPriorityOrder(null));
        for (int i = 0; i < selected.size(); i++) {
            selected.get(i).setPriorityOrder(i);
        }
        poll.close();
        return managed(poll);
    }

    @Scheduled(fixedDelay = 60_000)
    @Transactional
    public void deleteExpired() {
        polls.deleteExpired(Instant.now());
    }

    private MealPoll require(String id, boolean lock) {
        return (lock ? polls.lockById(id) : polls.findById(id))
                .filter(poll -> poll.getExpiresAt().isAfter(Instant.now()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Abfrage nicht gefunden oder nach fünf Tagen abgelaufen."));
    }

    private MealPoll owned(String id, String owner, boolean lock) {
        MealPoll poll = require(id, lock);
        if (!poll.getOwnerEmail().equals(owner) || poll.getHouseholdId() != HouseholdContext.currentId()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Abfrage nicht gefunden.");
        }
        return poll;
    }

    private PublicPoll publicDto(MealPoll poll) {
        return new PublicPoll(poll.getId(), poll.getCreatedAt(), poll.getExpiresAt(), poll.isClosed(),
                poll.getOptions().stream().map(Option::from).toList());
    }

    private ManagedPoll managed(MealPoll poll) {
        List<MealPollVote> submitted = votes.findByPollIdOrderByIdAsc(poll.getId());
        Map<Long, Long> sums = new HashMap<>();
        for (MealPollVote vote : submitted) {
            List<Long> ranking = vote.getRanking();
            for (int i = 0; i < ranking.size(); i++) {
                sums.merge(ranking.get(i), (long) i + 1, Long::sum);
            }
        }
        List<Result> results = poll.getOptions().stream()
                .map(option -> new Result(Option.from(option),
                        submitted.isEmpty() ? null : (double) sums.get(option.getEntryId()) / submitted.size()))
                // Stable sorting preserves the original schedule order for exact ties.
                .sorted(Comparator.comparing(Result::averageRank, Comparator.nullsLast(Comparator.naturalOrder())))
                .toList();
        return new ManagedPoll(publicDto(poll), submitted.size(), results,
                submitted.stream().map(vote -> new VoteResult(vote.getVoterName(), vote.getRanking())).toList());
    }
}
