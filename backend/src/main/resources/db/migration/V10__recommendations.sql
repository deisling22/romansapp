CREATE TABLE content_trend_score (
    content_key VARCHAR(40) PRIMARY KEY,
    content_type VARCHAR(20) NOT NULL,
    content_id BIGINT NOT NULL,
    score DOUBLE PRECISION NOT NULL DEFAULT 0,
    last_event_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_content_trend_type_id ON content_trend_score(content_type, content_id);
