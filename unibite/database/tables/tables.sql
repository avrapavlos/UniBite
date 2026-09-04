USE unibite;

DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS allergens;
DROP TABLE IF EXISTS advertisments;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    username VARCHAR(50) NOT NULL UNIQUE,

    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,

    name VARCHAR(100) NOT NULL,

    points INT DEFAULT 0,

    portions_given INT DEFAULT 0,
    portions_received INT DEFAULT 0,

    profile_picture VARCHAR(255),

    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE advertisments (
    ad_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,

    creator_id INT NOT NULL,

    title VARCHAR(255) NOT NULL,

    description TEXT NOT NULL,

    price INT NOT NULL DEFAULT 0,

    date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    date_of_deletion TIMESTAMP,

    date_of_delivery TIMESTAMP,

    latitude DECIMAL(9,6) NOT NULL,

    longitude DECIMAL(9,6) NOT NULL,

    building_name VARCHAR(255) NOT NULL,

    room_number VARCHAR(255) NOT NULL,

    quantity INT NOT NULL,

    path_to_picture VARCHAR(255),

    state_of_ad ENUM(
        'ACTIVE',
        'INACTIVE',
        'DELETED'
    ) NOT NULL,

    CONSTRAINT fk_ad_creator
        FOREIGN KEY (creator_id)
        REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE allergens (
    allergen_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,

    allergen_name VARCHAR(255) NOT NULL,

    ad_id INT NOT NULL,

    CONSTRAINT unique_ad_allergen
        UNIQUE (ad_id, allergen_name),

    CONSTRAINT fk_allergen_ad
        FOREIGN KEY (ad_id)
        REFERENCES advertisments(ad_id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE requests(
    request_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ad_id INT NOT NULL,
    con_id INT,
    state_of_delivery ENUM (
        'DELIVERED',
        'MISSED'
    ) DEFAULT 'DELIVERED',
    missedDeliveryPenalty BOOLEAN DEFAULT FALSE,
    penalty_applied BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_advertisment
        FOREIGN KEY(ad_id)
        REFERENCES advertisments(ad_id),
    CONSTRAINT fk_consumer
        FOREIGN KEY(con_id)
        REFERENCES users(id)
);

CREATE TABLE ratings(
    rating_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    req_id INT NOT NULL,
    description TEXT,
    CONSTRAINT fk_requests
        FOREIGN KEY(req_id)
        REFERENCES requests(request_id)
);

DROP TABLE IF EXISTS admins;

CREATE TABLE admins(
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255),
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP USER IF EXISTS'user'@'localhost';
CREATE USER 'user'@'localhost'
IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON unibite.* TO 'user'@'localhost';

FLUSH PRIVILEGES;

DELIMITER $$

CREATE TRIGGER calcDeletion BEFORE INSERT ON advertisments FOR EACH ROW
BEGIN
    SET NEW.date_of_deletion = ADDDATE(CURRENT_TIMESTAMP(), INTERVAL 48 HOUR);
END$$

CREATE EVENT deactivateAd
ON SCHEDULE EVERY 1 HOUR
DO
    UPDATE advertisments
    SET state_of_ad = 'DELETED' WHERE date_of_deletion >= CURRENT_TIMESTAMP() AND state_of_ad <> 'DELETED'$$

CREATE TRIGGER inactivation BEFORE INSERT ON requests FOR EACH ROW
BEGIN
    DECLARE portions INT;
    SELECT quantity INTO portions FROM advertisments WHERE advertisments.ad_id = new.ad_id;
    IF portions - 1 = 0 THEN UPDATE advertisments SET state_of_ad = 'INACTIVE', quantity = 0 WHERE advertisments.ad_id = new.ad_id;
    ELSE UPDATE advertisments SET quantity = portions - 1 WHERE advertisments.ad_id = new.ad_id;
    END IF;
END$$

CREATE EVENT missedDelivery
ON SCHEDULE EVERY 1 HOUR
DO
BEGIN
    UPDATE users u
    JOIN (
        SELECT con_id, COUNT(*) AS missed_count
        FROM requests
        WHERE state_of_delivery = 'MISSED'
          AND missedDeliveryPenalty = FALSE
        GROUP BY con_id
    ) r ON u.con_id = r.con_id
    SET u.points = u.points - r.missed_count;

    UPDATE requests
    SET missedDeliveryPenalty = TRUE
    WHERE state_of_delivery = 'MISSED'
      AND missedDeliveryPenalty = FALSE;
END$$

CREATE EVENT noRating
ON SCHEDULE EVERY 1 HOUR
DO
    UPDATE users u
    INNER JOIN requests req
    ON u.id = req.con_id
    INNER JOIN advertisments ad
    ON req.ad_id = ad.ad_id
    LEFT JOIN ratings rat
    ON req.request_id = rat.req_id
    SET
    u.points = u.points - 1,
    req.penalty_applied = TRUE
    WHERE
    rat.req_id IS NULL
    AND req.penalty_applied = FALSE
    AND CURRENT_TIMESTAMP >= ADDDATE(
        ad.date_of_delivery,
        INTERVAL 48 HOUR
    )$$

DELIMITER ;