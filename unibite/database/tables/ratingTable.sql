use unibite;

DROP TABLE IF EXISTS ratings;

CREATE TABLE ratings(
    id INT,
    CONSTRAINT fk_requests
        FOREIGN KEY(id)
        REFERENCES requests(con_id),
    description TEXT
);