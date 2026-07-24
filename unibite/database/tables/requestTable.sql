use unibite;

DROP TABLE IF EXISTS requests

CREATE TABLE requests(
    ADD CONSTRAINT fk_advertisment,
    FOREIGN KEY(ad_id),
    REFERENCES advertisments(ad_id),
    ADD CONSTRAINT fk_consumer,
    FOREIGN KEY(con_id),
    REFERENCES users(user_id)
);