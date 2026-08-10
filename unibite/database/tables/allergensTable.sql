USE unibite;

DROP TABLE IF EXISTS allergens;

CREATE TABLE allergens(
    allergen_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    allergen_name VARCHAR(255) NOT NULL,
    offer_id INT NOT NULL,

    CONSTRAINT unique_offer_allergen
        UNIQUE (offer_id, allergen_name),

    CONSTRAINT fk_allergen_offer
        FOREIGN KEY (offer_id)
        REFERENCES offers(id)
        ON DELETE CASCADE
);