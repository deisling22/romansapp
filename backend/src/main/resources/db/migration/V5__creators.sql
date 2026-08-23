CREATE TABLE creator (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    handle VARCHAR(80) NOT NULL UNIQUE,
    bio VARCHAR(500) NOT NULL,
    avatar_url VARCHAR(500) NOT NULL,
    reel_image_url VARCHAR(500) NOT NULL
);

ALTER TABLE meal_plan ADD COLUMN creator_id BIGINT REFERENCES creator(id);
CREATE INDEX idx_meal_plan_creator_id ON meal_plan(creator_id);