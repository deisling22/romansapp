ALTER TABLE creator ADD COLUMN reel_video_url VARCHAR(500);
ALTER TABLE plan_entry ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE creator_subscription (
    id BIGSERIAL PRIMARY KEY,
    owner_email VARCHAR(320) NOT NULL,
    creator_id BIGINT NOT NULL REFERENCES creator(id) ON DELETE CASCADE,
    subscribed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_checked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_creator_subscription_owner UNIQUE (owner_email, creator_id)
);

INSERT INTO creator (name, handle, bio, avatar_url, reel_image_url, reel_video_url) VALUES
('Lea Winter', 'leasofenkueche', 'Ofengerichte mit wenig Aufwand und viel Aroma.',
 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=85',
 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1000&q=85',
 'assets/videos/creator-kitchen-3s.mp4'),
('Noah Berger', 'noahmealprep', 'Praktisches Meal Prep für entspannte Wochentage.',
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=85',
 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85',
 'assets/videos/creator-table-3s.mp4'),
('Sofia Marin', 'sofiasmediterran', 'Mediterrane Küche, frische Kräuter und einfache Zutaten.',
 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=300&q=85',
 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85', NULL),
('Emil Koch', 'emilkochtgruen', 'Gemüsestarke Alltagsküche ohne komplizierte Schritte.',
 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=85',
 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=85', NULL),
('Nina Roth', 'ninasfamilienzeit', 'Familienrezepte, die gemeinsam schnell auf dem Tisch stehen.',
 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=300&q=85',
 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=85', NULL);