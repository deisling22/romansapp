CREATE TABLE dish_favorite (
    id BIGSERIAL PRIMARY KEY,
    dish_id BIGINT NOT NULL REFERENCES dish(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_dish_favorite_dish_user UNIQUE (dish_id, user_email)
);