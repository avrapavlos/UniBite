use unibite;

DROP TABLE IF EXISTS ratings;

CREATE TABLE ratings(
    rating_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    req_id INT NOT NULL,
    description TEXT,
    CONSTRAINT fk_requests
        FOREIGN KEY(req_id)
        REFERENCES requests(request_id)
);