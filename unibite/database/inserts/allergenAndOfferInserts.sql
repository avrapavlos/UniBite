USE unibite;

-- TODO: REMOVE ALERGER IDS FROM OFFERS TABLE AND CREATE A NEW TABLE FOR ALLERGENS
-- =====================================================
-- DROP EXISTING TABLES
-- =====================================================

DROP TABLE IF EXISTS allergens;
DROP TABLE IF EXISTS offers;


-- =====================================================
-- CREATE OFFERS TABLE
-- =====================================================

CREATE TABLE offers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    creator_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    portions INT NOT NULL DEFAULT 0,

    location_lat DECIMAL(9,6) NOT NULL,
    location_lng DECIMAL(9,6) NOT NULL,
    building VARCHAR(100),
    room VARCHAR(100),

    pickup_time DATETIME NOT NULL,
    address VARCHAR(255),
    distance DECIMAL(6,2),
    image VARCHAR(255),

    point_cost INT NOT NULL DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_offers_creator
        FOREIGN KEY (creator_id)
        REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;


-- =====================================================
-- CREATE ALLERGENS TABLE
-- =====================================================

CREATE TABLE allergens (
    allergen_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    allergen_name VARCHAR(255) NOT NULL,
    offer_id INT NOT NULL,

    CONSTRAINT unique_offer_allergen
        UNIQUE (offer_id, allergen_name),

    CONSTRAINT fk_allergen_offer
        FOREIGN KEY (offer_id)
        REFERENCES offers(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;


-- =====================================================
-- INSERT OFFERS
-- =====================================================

INSERT INTO offers (
    creator_id,
    title,
    description,
    portions,
    location_lat,
    location_lng,
    building,
    room,
    pickup_time,
    address,
    distance,
    image,
    point_cost
)
VALUES

(
    1,
    'Homemade Pepperoni Pizza',
    'Fresh homemade pizza with tomato sauce, mozzarella and pepperoni.',
    4,
    39.475000,
    21.920000,
    'Main University Building',
    'Room 101',
    '2026-08-10 17:30:00',
    'University Campus',
    0.30,
    'pepperoni_pizza.jpg',
    40
),

(
    1,
    'Chicken Sandwich',
    'Grilled chicken sandwich with lettuce, tomato and a light sauce.',
    2,
    39.475100,
    21.920100,
    'Main University Building',
    'Room 102',
    '2026-08-10 18:00:00',
    'University Campus',
    0.35,
    'chicken_sandwich.jpg',
    25
),

(
    1,
    'Vegetarian Wrap',
    'Fresh tortilla wrap filled with lettuce, tomato, cucumber and corn.',
    3,
    39.475200,
    21.920200,
    'Student Center',
    'Room 12',
    '2026-08-11 13:00:00',
    'University Campus',
    0.40,
    'vegetarian_wrap.jpg',
    25
),

(
    2,
    'Homemade Lasagna',
    'Traditional homemade lasagna with minced beef, tomato sauce and cheese.',
    3,
    39.476000,
    21.921000,
    'Engineering Building',
    'Room 204',
    '2026-08-10 14:00:00',
    'University Campus',
    0.55,
    'lasagna.jpg',
    50
),

(
    2,
    'Chocolate Muffins',
    'Soft homemade chocolate muffins, perfect for a study break.',
    6,
    39.476100,
    21.921100,
    'Engineering Building',
    'Room 205',
    '2026-08-11 11:30:00',
    'University Campus',
    0.60,
    'chocolate_muffins.jpg',
    15
),

(
    3,
    'Vegetable Pasta',
    'Pasta with fresh vegetables, tomato sauce and herbs.',
    4,
    39.474500,
    21.919500,
    'Science Building',
    'Room 103',
    '2026-08-10 15:30:00',
    'University Campus',
    0.25,
    'vegetable_pasta.jpg',
    30
),

(
    3,
    'Greek Salad',
    'Fresh Greek salad with tomatoes, cucumber, olives, feta and oregano.',
    3,
    39.474600,
    21.919600,
    'Science Building',
    'Room 104',
    '2026-08-11 13:30:00',
    'University Campus',
    0.30,
    'greek_salad.jpg',
    25
),

(
    4,
    'Chicken with Rice',
    'Homemade roasted chicken served with seasoned rice and vegetables.',
    5,
    39.475500,
    21.920500,
    'Library',
    'Study Room 3',
    '2026-08-10 18:30:00',
    'University Library',
    0.45,
    'chicken_rice.jpg',
    40
),

(
    4,
    'Homemade Apple Pie',
    'Homemade apple pie with cinnamon and a crispy pastry crust.',
    4,
    39.475600,
    21.920600,
    'Library',
    'Study Room 4',
    '2026-08-11 16:00:00',
    'University Library',
    0.50,
    'apple_pie.jpg',
    20
),

(
    4,
    'Beef Rice Bowl',
    'Seasoned beef served with rice, vegetables and homemade sauce.',
    3,
    39.475700,
    21.920700,
    'Library',
    'Study Room 5',
    '2026-08-12 14:30:00',
    'University Library',
    0.55,
    'beef_rice_bowl.jpg',
    45
),

(
    5,
    'Cheese Toast',
    'Simple toasted sandwich with melted cheese.',
    4,
    39.473900,
    21.918900,
    'Student Center',
    'Room 8',
    '2026-08-10 12:30:00',
    'University Campus',
    0.70,
    'cheese_toast.jpg',
    15
),

(
    5,
    'Homemade Burgers',
    'Juicy homemade beef burgers served with fresh vegetables and sauce.',
    3,
    39.474000,
    21.919000,
    'Student Center',
    'Room 9',
    '2026-08-11 19:00:00',
    'University Campus',
    0.65,
    'homemade_burger.jpg',
    40
),

(
    6,
    'Chicken Pasta',
    'Creamy pasta with grilled chicken and herbs.',
    4,
    39.476200,
    21.922000,
    'Arts Building',
    'Room 301',
    '2026-08-10 17:00:00',
    'University Campus',
    0.80,
    'chicken_pasta.jpg',
    45
),

(
    6,
    'Banana Bread',
    'Soft homemade banana bread with a hint of cinnamon.',
    5,
    39.476300,
    21.922100,
    'Arts Building',
    'Room 302',
    '2026-08-11 12:00:00',
    'University Campus',
    0.85,
    'banana_bread.jpg',
    20
),

(
    6,
    'Cheesecake Slice',
    'Creamy homemade cheesecake with a crunchy biscuit base.',
    4,
    39.476400,
    21.922200,
    'Arts Building',
    'Room 303',
    '2026-08-12 15:00:00',
    'University Campus',
    0.90,
    'cheesecake.jpg',
    25
),

(
    7,
    'Tuna Sandwich',
    'Tuna sandwich with lettuce, tomato and homemade sauce.',
    3,
    39.474800,
    21.920200,
    'Business Building',
    'Room 110',
    '2026-08-10 13:00:00',
    'University Campus',
    0.40,
    'tuna_sandwich.jpg',
    25
),

(
    7,
    'French Toast',
    'Freshly prepared French toast with cinnamon and honey.',
    4,
    39.474900,
    21.920300,
    'Business Building',
    'Room 111',
    '2026-08-11 10:30:00',
    'University Campus',
    0.45,
    'french_toast.jpg',
    20
),

(
    8,
    'Homemade Moussaka',
    'Traditional homemade moussaka with potatoes, eggplant, minced meat and bechamel.',
    4,
    39.475800,
    21.919800,
    'Main University Building',
    'Room 210',
    '2026-08-10 14:30:00',
    'University Campus',
    0.35,
    'moussaka.jpg',
    50
),

(
    8,
    'Spinach and Feta Pie',
    'Homemade spinach and feta pie with crispy pastry.',
    5,
    39.475900,
    21.919900,
    'Main University Building',
    'Room 211',
    '2026-08-11 13:00:00',
    'University Campus',
    0.40,
    'spinach_pie.jpg',
    30
),

(
    8,
    'Chicken Wrap',
    'Grilled chicken wrapped with lettuce, tomato and yogurt sauce.',
    3,
    39.476000,
    21.920000,
    'Main University Building',
    'Room 212',
    '2026-08-12 17:30:00',
    'University Campus',
    0.45,
    'chicken_wrap.jpg',
    35
),

(
    9,
    'Margherita Pizza',
    'Classic Margherita pizza with tomato sauce, mozzarella and fresh basil.',
    4,
    39.473500,
    21.921500,
    'Computer Science Building',
    'Room 105',
    '2026-08-10 18:00:00',
    'University Campus',
    0.75,
    'margherita_pizza.jpg',
    35
),

(
    9,
    'Ham and Cheese Sandwich',
    'Toasted sandwich with ham and melted cheese.',
    3,
    39.473600,
    21.921600,
    'Computer Science Building',
    'Room 106',
    '2026-08-11 12:30:00',
    'University Campus',
    0.80,
    'ham_cheese_sandwich.jpg',
    20
),

(
    10,
    'Homemade Pasta Bake',
    'Oven-baked pasta with tomato sauce, vegetables and melted cheese.',
    5,
    39.476500,
    21.922500,
    'Medical Building',
    'Room 201',
    '2026-08-10 16:30:00',
    'University Campus',
    1.00,
    'pasta_bake.jpg',
    45
),

(
    10,
    'Greek Yogurt with Honey',
    'Creamy Greek yogurt served with honey and walnuts.',
    4,
    39.476600,
    21.922600,
    'Medical Building',
    'Room 202',
    '2026-08-11 11:00:00',
    'University Campus',
    1.05,
    'yogurt_honey.jpg',
    25
);


-- =====================================================
-- INSERT ALLERGENS
-- =====================================================

INSERT INTO allergens (
    allergen_name,
    offer_id
)
VALUES

('MILK', 1),
('GLUTEN', 1),

('GLUTEN', 2),

('GLUTEN', 3),

('MILK', 4),
('GLUTEN', 4),

('GLUTEN', 5),
('MILK', 5),
('EGG', 5),

('GLUTEN', 6),

('MILK', 7),

('GLUTEN', 9),
('MILK', 9),
('EGG', 9),

('SOY BEAN', 10),

('MILK', 11),
('GLUTEN', 11),

('GLUTEN', 12),
('MUSTARD', 12),

('MILK', 13),
('GLUTEN', 13),

('GLUTEN', 14),
('EGG', 14),

('MILK', 15),
('GLUTEN', 15),
('EGG', 15),

('FISH', 16),
('GLUTEN', 16),

('EGG', 17),
('MILK', 17),
('GLUTEN', 17),

('MILK', 18),
('EGG', 18),

('GLUTEN', 19),
('MILK', 19),

('GLUTEN', 20),
('MILK', 20),

('MILK', 21),
('GLUTEN', 21),

('MILK', 22),
('GLUTEN', 22),

('MILK', 23),
('GLUTEN', 23),

('MILK', 24),
('PEANUTS', 24);