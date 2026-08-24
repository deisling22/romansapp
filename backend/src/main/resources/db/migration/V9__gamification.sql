CREATE TABLE gamification_event (
    id BIGSERIAL PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    owner_email VARCHAR(320) NOT NULL,
    event_type VARCHAR(40) NOT NULL,
    reference_id VARCHAR(120),
    occurred_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_gamification_event_owner UNIQUE (owner_email, event_id)
);

CREATE INDEX idx_gamification_event_owner_time ON gamification_event(owner_email, occurred_at);

CREATE TABLE gamification_profile (
    owner_email VARCHAR(320) PRIMARY KEY,
    selected_frame VARCHAR(30) NOT NULL DEFAULT 'CLASSIC',
    selected_title VARCHAR(40) NOT NULL DEFAULT 'KUECHENSTARTER',
    weekly_cook_target INTEGER NOT NULL DEFAULT 4,
    household_weekly_target INTEGER NOT NULL DEFAULT 8,
    streak_shields_used INTEGER NOT NULL DEFAULT 0,
    shield_month VARCHAR(7)
);