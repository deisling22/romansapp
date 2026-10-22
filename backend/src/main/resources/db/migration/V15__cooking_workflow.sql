ALTER TABLE meal_plan ADD COLUMN active BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE meal_plan ADD COLUMN leftovers_for_lunch BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE plan_entry ADD COLUMN meal_slot VARCHAR(20) NOT NULL DEFAULT 'DINNER';

ALTER TABLE dish ADD COLUMN advance_prep_note VARCHAR(500);

ALTER TABLE user_profile ADD COLUMN household_size INT NOT NULL DEFAULT 1;
ALTER TABLE user_profile ADD COLUMN shopping_trips_per_week INT NOT NULL DEFAULT 2;

CREATE TABLE cook_log (
    id BIGSERIAL PRIMARY KEY,
    plan_entry_id BIGINT REFERENCES plan_entry(id) ON DELETE SET NULL,
    plan_id BIGINT REFERENCES meal_plan(id) ON DELETE SET NULL,
    dish_id BIGINT NOT NULL REFERENCES dish(id) ON DELETE CASCADE,
    meal_slot VARCHAR(20) NOT NULL,
    leftovers BOOLEAN NOT NULL DEFAULT FALSE,
    cooked_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_cook_log_cooked_at ON cook_log (cooked_at);

-- Keep today's nutrition totals intact for dishes cooked before the cook log existed.
INSERT INTO cook_log (plan_entry_id, plan_id, dish_id, meal_slot, leftovers, cooked_at)
SELECT pe.id, pe.plan_id, pe.dish_id, pe.meal_slot, FALSE, pe.cooked_at
FROM plan_entry pe
JOIN meal_plan mp ON mp.id = pe.plan_id
WHERE pe.cooked = TRUE AND pe.cooked_at IS NOT NULL AND mp.creator_id IS NULL;

CREATE TABLE staple_item (
    id BIGSERIAL PRIMARY KEY,
    ingredient_name VARCHAR(120) NOT NULL,
    quantity DOUBLE PRECISION NOT NULL,
    unit VARCHAR(20) NOT NULL
);
