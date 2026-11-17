-- Taste preferences without login, "less of this" feedback and pantry removal reasons

CREATE TABLE taste_preference (
    id BIGSERIAL PRIMARY KEY,
    household_id BIGINT NOT NULL,
    tag VARCHAR(60) NOT NULL,
    liked BOOLEAN NOT NULL DEFAULT FALSE,
    penalty DOUBLE PRECISION NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX idx_taste_preference_household_tag ON taste_preference(household_id, tag);

CREATE TABLE dish_feedback (
    id BIGSERIAL PRIMARY KEY,
    household_id BIGINT NOT NULL,
    dish_id BIGINT NOT NULL REFERENCES dish(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL
);
CREATE UNIQUE INDEX idx_dish_feedback_household_dish ON dish_feedback(household_id, dish_id);

CREATE TABLE pantry_removal (
    id BIGSERIAL PRIMARY KEY,
    household_id BIGINT NOT NULL,
    ingredient_name VARCHAR(120) NOT NULL,
    quantity DOUBLE PRECISION NOT NULL,
    unit VARCHAR(20) NOT NULL,
    reason VARCHAR(16) NOT NULL,
    removed_at TIMESTAMP NOT NULL
);
CREATE INDEX idx_pantry_removal_household ON pantry_removal(household_id, removed_at);
