CREATE TABLE meal_poll (
    id VARCHAR(36) PRIMARY KEY,
    owner_email VARCHAR(320) NOT NULL,
    household_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    closed BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX idx_meal_poll_owner ON meal_poll(owner_email, household_id);
CREATE INDEX idx_meal_poll_expiry ON meal_poll(expires_at);

CREATE TABLE meal_poll_option (
    poll_id VARCHAR(36) NOT NULL REFERENCES meal_poll(id) ON DELETE CASCADE,
    option_index INTEGER NOT NULL,
    entry_id BIGINT NOT NULL,
    dish_id BIGINT NOT NULL,
    name VARCHAR(120) NOT NULL,
    image_url VARCHAR(1000) NOT NULL,
    meal_slot VARCHAR(20) NOT NULL,
    PRIMARY KEY (poll_id, option_index)
);

CREATE TABLE meal_poll_vote (
    id BIGSERIAL PRIMARY KEY,
    poll_id VARCHAR(36) NOT NULL REFERENCES meal_poll(id) ON DELETE CASCADE,
    voter_name VARCHAR(80) NOT NULL,
    name_key VARCHAR(80) NOT NULL,
    ranking VARCHAR(220) NOT NULL,
    UNIQUE (poll_id, name_key)
);

ALTER TABLE plan_entry ADD COLUMN priority_order INTEGER;
