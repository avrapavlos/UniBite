use unibite;

Drop table if exists offers;

CREATE TABLE offers (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    creator_id     INT NOT NULL,
    title          VARCHAR(150) NOT NULL,
    description    TEXT,
    portions       INT NOT NULL DEFAULT 0,
 
    -- location fields
    location_lat   DECIMAL(9,6) NOT NULL,
    location_lng   DECIMAL(9,6) NOT NULL,
    building       VARCHAR(100),
    room           VARCHAR(100),
 
    pickup_time    DATETIME NOT NULL,
    address        VARCHAR(255),
    distance       DECIMAL(6,2),
    image          VARCHAR(255),
 
    point_cost     INT NOT NULL DEFAULT 0,
 
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 
    CONSTRAINT fk_offers_creator
        FOREIGN KEY (creator_id) REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;
