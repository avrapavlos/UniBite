USE unibite;

-- All seeded accounts (admins AND users) use the plain-text password: password123
-- NOTE: passwords are stored as-is (not hashed) to match the app's current
-- plain-text comparison logic in authController.js / adminController.js
-- (`WHERE password = ?`). If hashing is added later, re-generate this file.

-- ========================= --
-- Admins (2)
-- ========================= --

INSERT INTO admins (username, password, email) VALUES
('admin_root',    'password123', 'admin.root@unibite.edu'),
('admin_support', 'password123', 'support@unibite.edu');

-- ========================= --
-- Users (6)
-- ========================= --

INSERT INTO users (username, email, password, name, points, portions_given, portions_received, profile_picture, latitude, longitude) VALUES
('alex_kim',      'alex.kim@uni.edu',      'password123', 'Alex Kim',      42, 10, 3, '/uploads/profiles/alex_kim.jpg',      38.291800, 21.789700),
('maria_lopez',   'maria.lopez@uni.edu',   'password123', 'Maria Lopez',   27,  6, 5, '/uploads/profiles/maria_lopez.jpg',   38.292300, 21.788400),
('daniel_osei',   'daniel.osei@uni.edu',   'password123', 'Daniel Osei',   15,  3, 7, '/uploads/profiles/daniel_osei.jpg',   38.290500, 21.790800),
('priya_singh',   'priya.singh@uni.edu',   'password123', 'Priya Singh',    8,  2, 4, '/uploads/profiles/priya_singh.jpg',   38.293000, 21.787200),
('tom_becker',    'tom.becker@uni.edu',    'password123', 'Tom Becker',    19,  4, 2, '/uploads/profiles/tom_becker.jpg',    38.289600, 21.791600),
('sofia_ionescu', 'sofia.ionescu@uni.edu', 'password123', 'Sofia Ionescu', 33,  7, 1, '/uploads/profiles/sofia_ionescu.jpg', 38.294100, 21.786900);

-- ========================= --
-- Advertisments (16)
-- date_of_deletion is auto-computed by the calcDeletion trigger
-- (date_posted + 48h), so it is not set explicitly here.
-- ========================= --

INSERT INTO advertisments (creator_id, title, description, point_cost, date_of_delivery, location_lat, location_lng, building_name, room_number, portions, path_to_picture, state_of_ad) VALUES
(1, 'Leftover Pizza from Club Meeting',          'About 8 slices of pepperoni and veggie pizza left over from the CS club meeting.',        2, DATE_SUB(NOW(), INTERVAL 30 HOUR), 38.291800, 21.789700, 'Student Union',       '204',            8, '/uploads/ads/pizza.jpg',        'ACTIVE'),
(2, 'Extra Sushi Platters',                      'Two untouched sushi platters from a department seminar. Vegetarian rolls included.',      4, DATE_SUB(NOW(), INTERVAL 26 HOUR), 38.292300, 21.788400, 'Engineering Hall',    '110',            6, '/uploads/ads/sushi.jpg',        'ACTIVE'),
(3, 'Bakery Surplus - Croissants',               'Fresh croissants from the campus bakery, baked this morning and unsold.',                 1, DATE_SUB(NOW(), INTERVAL 22 HOUR), 38.290500, 21.790800, 'Campus Bakery',       'N/A',           12, '/uploads/ads/croissants.jpg',   'ACTIVE'),
(4, 'Vegetable Stir Fry - Cooking Class Extras', 'Large batch of vegetable stir fry made during today''s culinary elective.',               2, DATE_SUB(NOW(), INTERVAL 50 HOUR), 38.293000, 21.787200, 'Home Economics Bldg', '305',           10, '/uploads/ads/stirfry.jpg',      'ACTIVE'),
(5, 'Sandwich Platter from Seminar',             'Assorted sandwich halves left after a guest lecture, mostly turkey and hummus.',           2, DATE_SUB(NOW(), INTERVAL 18 HOUR), 38.289600, 21.791600, 'Arts Building',       '2',              5, '/uploads/ads/sandwiches.jpg',   'ACTIVE'),
(6, 'Fresh Fruit Bowls',                         'Pre-cut fruit bowls from a wellness fair, apples, grapes, and melon.',                     1, DATE_SUB(NOW(), INTERVAL 16 HOUR), 38.294100, 21.786900, 'Sports Complex',      'Lobby',          7, '/uploads/ads/fruit.jpg',        'ACTIVE'),
(1, 'Pasta Bake - Dorm Event Leftovers',         'Baked ziti from tonight''s dorm floor social, still warm.',                                3, DATE_SUB(NOW(), INTERVAL 14 HOUR), 38.291800, 21.789700, 'Maple Hall',          'Common Room',    9, '/uploads/ads/pasta.jpg',        'ACTIVE'),
(2, 'Bagels & Cream Cheese',                     'Boxed bagels with a few tubs of cream cheese left from a morning meeting.',                1, DATE_SUB(NOW(), INTERVAL 12 HOUR), 38.292300, 21.788400, 'Admin Building',      '112',           10, '/uploads/ads/bagels.jpg',       'ACTIVE'),
(3, 'Curry and Rice - Cultural Night',           'Chickpea curry and rice from the International Student Association cultural night.',      3, DATE_SUB(NOW(), INTERVAL 10 HOUR), 38.290500, 21.790800, 'Global Center',       'Main Hall',      8, '/uploads/ads/curry.jpg',        'ACTIVE'),
(4, 'Soup and Bread - Charity Event',            'Vegetable soup and fresh bread rolls from tonight''s charity dinner.',                     2, DATE_SUB(NOW(), INTERVAL  8 HOUR), 38.293000, 21.787200, 'Community Kitchen',   '1',              6, '/uploads/ads/soup.jpg',         'ACTIVE'),
(5, 'Cupcakes - Bake Sale Extras',               'Unsold cupcakes from the fundraiser bake sale, assorted flavors.',                         1, DATE_SUB(NOW(), INTERVAL  5 HOUR), 38.289600, 21.791600, 'Student Union',       'Atrium',        15, '/uploads/ads/cupcakes.jpg',     'ACTIVE'),
(6, 'Falafel Wraps - Food Truck Leftovers',      'Falafel wraps that the food truck pop-up couldn''t sell before closing.',                  2, DATE_SUB(NOW(), INTERVAL  2 HOUR), 38.294100, 21.786900, 'Quad',                'Food Truck Row', 5, '/uploads/ads/falafel.jpg',      'ACTIVE'),
(1, 'Granola Bars - Study Session Extras',       'Boxes of granola bars left over from a late-night study session giveaway.',                1, DATE_SUB(NOW(), INTERVAL  1 HOUR), 38.291800, 21.789700, 'Library',             'Study Room 3',  20, '/uploads/ads/granola.jpg',      'INACTIVE'),
(2, 'Veggie Burgers - BBQ Leftovers',            'Grilled veggie burgers from the dorm BBQ, buns included.',                                 2, DATE_SUB(NOW(), INTERVAL  1 HOUR), 38.292300, 21.788400, 'Maple Hall',          'Courtyard',      6, '/uploads/ads/veggieburgers.jpg','INACTIVE'),
(3, 'Rice Pudding - Dessert Night',              'Homemade rice pudding from the international dessert night.',                             1, DATE_SUB(NOW(), INTERVAL 60 HOUR), 38.290500, 21.790800, 'Global Center',       'Kitchen',        8, '/uploads/ads/ricepudding.jpg',  'DELETED'),
(4, 'Chicken Wraps - Sports Event Leftovers',    'Chicken wraps left over from the intramural sports tournament.',                          2, DATE_SUB(NOW(), INTERVAL 55 HOUR), 38.293000, 21.787200, 'Sports Complex',      'Concessions',    5, '/uploads/ads/chickenwraps.jpg', 'DELETED');

-- ========================= --
-- Allergens (14 official allergens used across the ads above)
-- ========================= --

INSERT INTO allergens (allergen_name, id) VALUES
('gluten', 1), ('dairy', 1),
('fish', 2), ('soybeans', 2),
('gluten', 3), ('dairy', 3),
('soybeans', 4),
('gluten', 5),
('gluten', 7), ('dairy', 7),
('gluten', 8), ('dairy', 8),
('gluten', 9),
('dairy', 10), ('gluten', 10),
('gluten', 11), ('dairy', 11),
('gluten', 12),
('gluten', 13), ('nuts', 13),
('gluten', 14), ('soybeans', 14),
('dairy', 15), ('eggs', 15),
('gluten', 16),
('crustaceans', 2),
('sesame', 12),
('mustard', 9),
('celery', 6),
('sulphur dioxide', 5),
('lupin', 3),
('molluscs', 2),
('peanuts', 13);

-- ========================= --
-- Requests (20)
-- 9 ACCEPTED (7 DELIVERED, 2 MISSED), 7 PENDING, 4 REJECTED
-- ========================= --

INSERT INTO requests (id, con_id, status, claimed_portions, date_posted, accepted_at, rejected_at, updated_at, state_of_delivery, missedDeliveryPenalty, penalty_applied) VALUES
(1,  2, 'ACCEPTED', 2, DATE_SUB(NOW(), INTERVAL 30 HOUR), DATE_SUB(NOW(), INTERVAL 29 HOUR), NULL, DATE_SUB(NOW(), INTERVAL 29 HOUR), 'DELIVERED', FALSE, FALSE), -- req 1
(1,  3, 'REJECTED', 1, DATE_SUB(NOW(), INTERVAL 28 HOUR), NULL, DATE_SUB(NOW(), INTERVAL 27 HOUR), DATE_SUB(NOW(), INTERVAL 27 HOUR), 'DELIVERED', FALSE, FALSE), -- req 2
(2,  1, 'ACCEPTED', 1, DATE_SUB(NOW(), INTERVAL 26 HOUR), DATE_SUB(NOW(), INTERVAL 25 HOUR), NULL, DATE_SUB(NOW(), INTERVAL 25 HOUR), 'DELIVERED', FALSE, FALSE), -- req 3
(2,  4, 'PENDING',  2, DATE_SUB(NOW(), INTERVAL 5 HOUR),  NULL, NULL, NULL, 'DELIVERED', FALSE, FALSE), -- req 4
(3,  5, 'ACCEPTED', 3, DATE_SUB(NOW(), INTERVAL 22 HOUR), DATE_SUB(NOW(), INTERVAL 21 HOUR), NULL, DATE_SUB(NOW(), INTERVAL 21 HOUR), 'DELIVERED', FALSE, FALSE), -- req 5
(3,  6, 'PENDING',  1, DATE_SUB(NOW(), INTERVAL 4 HOUR),  NULL, NULL, NULL, 'DELIVERED', FALSE, FALSE), -- req 6
(4,  2, 'ACCEPTED', 2, DATE_SUB(NOW(), INTERVAL 50 HOUR), DATE_SUB(NOW(), INTERVAL 49 HOUR), NULL, DATE_SUB(NOW(), INTERVAL 3 HOUR),  'MISSED',    TRUE,  TRUE),  -- req 7 (missed pickup)
(4,  1, 'REJECTED', 1, DATE_SUB(NOW(), INTERVAL 20 HOUR), NULL, DATE_SUB(NOW(), INTERVAL 19 HOUR), DATE_SUB(NOW(), INTERVAL 19 HOUR), 'DELIVERED', FALSE, FALSE), -- req 8
(5,  3, 'ACCEPTED', 1, DATE_SUB(NOW(), INTERVAL 18 HOUR), DATE_SUB(NOW(), INTERVAL 17 HOUR), NULL, DATE_SUB(NOW(), INTERVAL 17 HOUR), 'DELIVERED', FALSE, FALSE), -- req 9
(5,  6, 'PENDING',  2, DATE_SUB(NOW(), INTERVAL 3 HOUR),  NULL, NULL, NULL, 'DELIVERED', FALSE, FALSE), -- req 10
(6,  4, 'ACCEPTED', 2, DATE_SUB(NOW(), INTERVAL 16 HOUR), DATE_SUB(NOW(), INTERVAL 15 HOUR), NULL, DATE_SUB(NOW(), INTERVAL 15 HOUR), 'DELIVERED', FALSE, FALSE), -- req 11
(6,  5, 'PENDING',  1, DATE_SUB(NOW(), INTERVAL 2 HOUR),  NULL, NULL, NULL, 'DELIVERED', FALSE, FALSE), -- req 12
(7,  4, 'ACCEPTED', 3, DATE_SUB(NOW(), INTERVAL 14 HOUR), DATE_SUB(NOW(), INTERVAL 13 HOUR), NULL, DATE_SUB(NOW(), INTERVAL 13 HOUR), 'DELIVERED', FALSE, FALSE), -- req 13
(7,  6, 'REJECTED', 1, DATE_SUB(NOW(), INTERVAL 12 HOUR), NULL, DATE_SUB(NOW(), INTERVAL 11 HOUR), DATE_SUB(NOW(), INTERVAL 11 HOUR), 'DELIVERED', FALSE, FALSE), -- req 14
(9,  2, 'ACCEPTED', 2, DATE_SUB(NOW(), INTERVAL 10 HOUR), DATE_SUB(NOW(), INTERVAL 9 HOUR),  NULL, DATE_SUB(NOW(), INTERVAL 9 HOUR),  'DELIVERED', FALSE, FALSE), -- req 15
(9,  1, 'PENDING',  1, DATE_SUB(NOW(), INTERVAL 1 HOUR),  NULL, NULL, NULL, 'DELIVERED', FALSE, FALSE), -- req 16
(11, 2, 'ACCEPTED', 1, DATE_SUB(NOW(), INTERVAL 40 HOUR), DATE_SUB(NOW(), INTERVAL 39 HOUR), NULL, DATE_SUB(NOW(), INTERVAL 6 HOUR),  'MISSED',    TRUE,  TRUE),  -- req 17 (missed pickup)
(12, 3, 'PENDING',  2, DATE_SUB(NOW(), INTERVAL 2 HOUR),  NULL, NULL, NULL, 'DELIVERED', FALSE, FALSE), -- req 18
(13, 5, 'REJECTED', 1, DATE_SUB(NOW(), INTERVAL 8 HOUR),  NULL, DATE_SUB(NOW(), INTERVAL 7 HOUR), DATE_SUB(NOW(), INTERVAL 7 HOUR),  'DELIVERED', FALSE, FALSE), -- req 19
(16, 6, 'PENDING',  2, DATE_SUB(NOW(), INTERVAL 1 HOUR),  NULL, NULL, NULL, 'DELIVERED', FALSE, FALSE); -- req 20

-- ========================= --
-- Ratings (for a few of the delivered/accepted orders)
-- ========================= --

INSERT INTO ratings (req_id, rater_id, rated_user_id, score, comment) VALUES
(1,  2, 1, 5, 'Pizza was still warm and the pickup was easy, would grab again!'),
(3,  1, 2, 4, 'Sushi was fresh, just had to wait a bit at pickup.'),
(9,  3, 5, 5, 'Sandwiches were perfect for a quick meal between classes.'),
(13, 4, 1, 4, 'Pasta was good, portion size was generous for the point cost.');