ALTER TABLE dish ADD COLUMN description VARCHAR(2000);
ALTER TABLE dish ADD COLUMN prep_minutes INTEGER;
ALTER TABLE dish ADD COLUMN servings INTEGER NOT NULL DEFAULT 1;
ALTER TABLE dish ADD COLUMN tags VARCHAR(255);

ALTER TABLE plan_entry ADD COLUMN cooked BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE plan_entry ADD COLUMN cooked_at TIMESTAMP;

CREATE TABLE ingredient (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    kcal_per_100 DOUBLE PRECISION NOT NULL,
    protein_per_100 DOUBLE PRECISION NOT NULL,
    unit VARCHAR(20) NOT NULL DEFAULT 'g'
);

CREATE TABLE dish_ingredient (
    id BIGSERIAL PRIMARY KEY,
    dish_id BIGINT NOT NULL REFERENCES dish(id) ON DELETE CASCADE,
    ingredient_id BIGINT NOT NULL REFERENCES ingredient(id),
    quantity_grams DOUBLE PRECISION NOT NULL
);

CREATE TABLE dish_image (
    id BIGSERIAL PRIMARY KEY,
    dish_id BIGINT NOT NULL REFERENCES dish(id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL,
    sort_order INTEGER NOT NULL
);

CREATE TABLE prep_step (
    id BIGSERIAL PRIMARY KEY,
    dish_id BIGINT NOT NULL REFERENCES dish(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    text VARCHAR(2000) NOT NULL,
    timer_seconds INTEGER
);

CREATE TABLE shopping_list_item (
    id BIGSERIAL PRIMARY KEY,
    plan_id BIGINT NOT NULL REFERENCES meal_plan(id) ON DELETE CASCADE,
    ingredient_name VARCHAR(120) NOT NULL,
    quantity DOUBLE PRECISION NOT NULL,
    unit VARCHAR(20) NOT NULL,
    checked BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE user_profile (
    id BIGINT PRIMARY KEY,
    default_portion_size DOUBLE PRECISION NOT NULL DEFAULT 1,
    body_weight_kg DOUBLE PRECISION,
    body_height_cm DOUBLE PRECISION
);

INSERT INTO user_profile (id, default_portion_size, body_weight_kg, body_height_cm)
VALUES (1, 1, 80, 180);
