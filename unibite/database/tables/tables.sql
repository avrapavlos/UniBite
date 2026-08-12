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

    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    date_posted TIMESTAMP DEFAULT CURRNT_TIMESTAMP,

    latitude DECIMAL(9,6) NOT NULL,

    longitude DECIMAL(9,6) NOT NULL,

    quality INT NOT NULL,

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

DROP USER 'user'@'localhost';
CREATE USER 'user'@'localhost'
IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON unibite.* TO 'user'@'localhost';

FLUSH PRIVILEGES;