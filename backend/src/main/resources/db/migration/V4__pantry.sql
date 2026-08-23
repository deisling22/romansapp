ALTER TABLE shopping_list_item ALTER COLUMN plan_id DROP NOT NULL;

CREATE TABLE pantry_item (
    id BIGSERIAL PRIMARY KEY,
    ingredient_name VARCHAR(120) NOT NULL,
    quantity DOUBLE PRECISION NOT NULL,
    unit VARCHAR(20) NOT NULL,
    purchased_at TIMESTAMP NOT NULL
);
