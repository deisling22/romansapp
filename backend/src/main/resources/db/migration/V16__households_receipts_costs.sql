-- Households (multi-tenancy), receipts and manual costs

CREATE TABLE household (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    invite_code VARCHAR(16) UNIQUE,
    guest BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL
);

-- Existing data belongs to the default household (id 1)
INSERT INTO household (name, guest, created_at) VALUES ('Mein Haushalt', FALSE, CURRENT_TIMESTAMP);

CREATE TABLE household_member (
    email VARCHAR(320) PRIMARY KEY,
    household_id BIGINT NOT NULL REFERENCES household(id) ON DELETE CASCADE,
    role VARCHAR(16) NOT NULL,
    joined_at TIMESTAMP NOT NULL
);
CREATE INDEX idx_household_member_household ON household_member(household_id);

-- Shareable rows: NULL household = public catalog (creator plans and their dishes)
ALTER TABLE meal_plan ADD COLUMN household_id BIGINT;
ALTER TABLE meal_plan ADD COLUMN cost_eur DOUBLE PRECISION;
UPDATE meal_plan SET household_id = 1 WHERE creator_id IS NULL;
CREATE INDEX idx_meal_plan_household ON meal_plan(household_id);

ALTER TABLE dish ADD COLUMN household_id BIGINT;
ALTER TABLE dish ADD COLUMN cost_eur DOUBLE PRECISION;
UPDATE dish SET household_id = 1 WHERE id NOT IN (
    SELECT pe.dish_id FROM plan_entry pe JOIN meal_plan mp ON mp.id = pe.plan_id WHERE mp.creator_id IS NOT NULL);
CREATE INDEX idx_dish_household ON dish(household_id);

ALTER TABLE plan_entry ADD COLUMN household_id BIGINT;
UPDATE plan_entry SET household_id = (SELECT mp.household_id FROM meal_plan mp WHERE mp.id = plan_entry.plan_id);
CREATE INDEX idx_plan_entry_household ON plan_entry(household_id);

-- Private rows
ALTER TABLE shopping_list_item ADD COLUMN household_id BIGINT;
UPDATE shopping_list_item SET household_id = 1;
ALTER TABLE shopping_list_item ALTER COLUMN household_id SET NOT NULL;
CREATE INDEX idx_shopping_list_item_household ON shopping_list_item(household_id);

ALTER TABLE pantry_item ADD COLUMN household_id BIGINT;
UPDATE pantry_item SET household_id = 1;
ALTER TABLE pantry_item ALTER COLUMN household_id SET NOT NULL;
CREATE INDEX idx_pantry_item_household ON pantry_item(household_id);

ALTER TABLE staple_item ADD COLUMN household_id BIGINT;
UPDATE staple_item SET household_id = 1;
ALTER TABLE staple_item ALTER COLUMN household_id SET NOT NULL;
CREATE INDEX idx_staple_item_household ON staple_item(household_id);

ALTER TABLE cook_log ADD COLUMN household_id BIGINT;
UPDATE cook_log SET household_id = 1;
ALTER TABLE cook_log ALTER COLUMN household_id SET NOT NULL;
CREATE INDEX idx_cook_log_household ON cook_log(household_id);

-- The profile id equals the household id; the existing singleton (id 1) stays with household 1
ALTER TABLE user_profile ADD COLUMN cost_tracking_enabled BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE user_profile ADD COLUMN weekly_budget_eur DOUBLE PRECISION;

CREATE TABLE receipt (
    id BIGSERIAL PRIMARY KEY,
    household_id BIGINT NOT NULL,
    purchased_on DATE NOT NULL,
    total_eur DOUBLE PRECISION NOT NULL,
    store VARCHAR(120),
    created_by VARCHAR(320),
    created_at TIMESTAMP NOT NULL
);
CREATE INDEX idx_receipt_household_date ON receipt(household_id, purchased_on);
