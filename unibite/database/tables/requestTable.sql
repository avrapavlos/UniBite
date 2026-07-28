use unibite;

DROP TABLE IF EXISTS requests;

CREATE TABLE requests(
    request_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ad_id INT NOT NULL,
    con_id INT,
    CONSTRAINT fk_advertisment
        FOREIGN KEY(ad_id)
        REFERENCES advertisments(ad_id),
    CONSTRAINT fk_consumer
        FOREIGN KEY(con_id)
        REFERENCES users(id)
);