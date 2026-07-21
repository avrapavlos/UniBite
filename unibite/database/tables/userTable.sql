use unibite;

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