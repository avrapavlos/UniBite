use unibite;

DROP TABLE IF EXISTS ratings;

CREATE TABLE ratings(
    ADD CONSTRAINT fk_requests,
    FOREIGN KEY(req_id),
    REFERENCES requests(req_id),
    description TEXT
);