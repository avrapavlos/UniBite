USE unibite;

DROP TABLE IF EXISTS allergens;

CREATE TABLE allergens(
    allergen_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    allergen_name VARCHAR(255) NOT NULL,
    ad_id INT NOT NULL,

    CONSTRAINT unique_ad_allergen
        UNIQUE (ad_id, allergen_name),

    CONSTRAINT fk_allergen_ad
        FOREIGN KEY (ad_id)
        REFERENCES advertisments(ad_id)
        ON DELETE CASCADE
);