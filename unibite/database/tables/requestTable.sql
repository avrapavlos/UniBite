use unibite;

DROP TABLE IF EXISTS requests;

CREATE TABLE requests(
    ad_id INT NOT NULL AUTO_INCREMENT,
    con_id INT,
    CONSTRAINT fk_advertisment
        FOREIGN KEY(ad_id)
        REFERENCES advertisments(ad_id),
    CONSTRAINT fk_consumer
        FOREIGN KEY(con_id)
        REFERENCES users(id)
);