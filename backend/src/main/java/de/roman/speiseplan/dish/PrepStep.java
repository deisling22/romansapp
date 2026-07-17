package de.roman.speiseplan.dish;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "prep_step")
public class PrepStep {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "dish_id", nullable = false)
    private Dish dish;

    @Column(name = "step_order", nullable = false)
    private int stepOrder;

    @Column(nullable = false, length = 2000)
    private String text;

    @Column(name = "timer_seconds")
    private Integer timerSeconds;

    protected PrepStep() {
    }

    public PrepStep(Dish dish, int stepOrder, String text, Integer timerSeconds) {
        this.dish = dish;
        this.stepOrder = stepOrder;
        this.text = text;
        this.timerSeconds = timerSeconds;
    }

    public Long getId() {
        return id;
    }

    public int getStepOrder() {
        return stepOrder;
    }

    public String getText() {
        return text;
    }

    public Integer getTimerSeconds() {
        return timerSeconds;
    }
}
