package de.roman.speiseplan.poll;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "meal_poll_vote")
public class MealPollVote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false)
    @JoinColumn(name = "poll_id", nullable = false)
    private MealPoll poll;
    @Column(name = "voter_name", nullable = false, length = 80)
    private String voterName;
    @Column(name = "name_key", nullable = false, length = 80)
    private String nameKey;
    @Column(nullable = false, length = 220)
    private String ranking;

    protected MealPollVote() {
    }

    public MealPollVote(MealPoll poll, String nameKey) {
        this.poll = poll;
        this.nameKey = nameKey;
    }

    public void update(String name, List<Long> entries) {
        voterName = name;
        ranking = entries.stream().map(String::valueOf).collect(Collectors.joining(","));
    }

    public String getVoterName() { return voterName; }
    public List<Long> getRanking() {
        return Arrays.stream(ranking.split(",")).map(Long::valueOf).toList();
    }
}
