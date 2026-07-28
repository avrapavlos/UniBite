use unibite;

DROP TABLE IF EXISTS advertisments;

CREATE TABLE advertisments(
    ad_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    creator_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    quality INT NOT NULL,
    path_to_picture VARCHAR(255),
    allergies ENUM("PEANUTS", "CELERY", "MILK", "GLUTEN", "SEASAME SEEDS", "MOLLUSCS", "CRUSTACEANS", "FISH", "EGG", "SOY BEAN", "MUSTARD", "LUPIN", "SULFUR DIOXIDE & SULFITES"),
    state_of_ad ENUM("ACTIVE", "INACTIVE", "DELETED") NOT NULL,
    CONSTRAINT fk_ad_creator
        FOREIGN KEY (creator_id)
        REFERENCES users(id)
);