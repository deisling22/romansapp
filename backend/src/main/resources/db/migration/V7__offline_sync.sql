ALTER TABLE meal_plan ADD COLUMN client_id VARCHAR(36);
ALTER TABLE meal_plan ADD COLUMN owner_email VARCHAR(320);
ALTER TABLE meal_plan ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE dish ADD COLUMN client_id VARCHAR(36);
ALTER TABLE dish ADD COLUMN owner_email VARCHAR(320);
ALTER TABLE dish ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX uk_meal_plan_owner_client ON meal_plan(owner_email, client_id);
CREATE UNIQUE INDEX uk_dish_owner_client ON dish(owner_email, client_id);