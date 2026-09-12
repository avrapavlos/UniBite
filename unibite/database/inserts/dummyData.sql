USE unibite;

-- ========================= --
-- Admins (2)
-- ========================= --

INSERT INTO admins (username, password, email) VALUES
('admin_root',    '$2y$10$Nx1QhE7f8m2Kd0aVYtG5Ku8h1s1yzKq7z4G0m1Yq2sX9pQwB1cD3e', 'admin.root@unibite.edu'),
('admin_support', '$2y$10$Rt9WvF3n5p1Bd6aXQmH2Ju7g0r2xzMp5y3F9l0Xp1wR8oPvA0bC2d', 'support@unibite.edu');

-- ========================= --
-- Users (4)
-- ========================= --

INSERT INTO users (username, email, password, name, points, portions_given, portions_received, profile_picture, latitude, longitude) VALUES
('alex_kim',     'alex.kim@uni.edu',      '$2y$10$abc1def2ghi3jkl4mno5pu6qrs7tuv8wxy9zab0cde1fgh2ijk3l', 'Alex Kim',     42, 10, 3, '/uploads/profiles/alex_kim.jpg',     37.871900, -122.258500),
('maria_lopez',  'maria.lopez@uni.edu',   '$2y$10$bcd2efg3hij4klm5nop6qr7stu8vwx9yza0bcd1efg2hij3klm4n', 'Maria Lopez',  27,  6, 5, '/uploads/profiles/maria_lopez.jpg', 37.872400, -122.259800),
('daniel_osei',  'daniel.osei@uni.edu',   '$2y$10$cde3fgh4ijk5lmn6opq7rs8tuv9wxy0zab1cde2fgh3ijk4lmn5o', 'Daniel Osei',  15,  3, 7, '/uploads/profiles/daniel_osei.jpg', 37.870600, -122.257100),
('priya_singh',  'priya.singh@uni.edu',   '$2y$10$def4ghi5jkl6mno7pqr8st9uvw0xyz1abc2def3ghi4jkl5mno6p', 'Priya Singh',   8,  2, 4, '/uploads/profiles/priya_singh.jpg', 37.873100, -122.260200);

-- ========================= --
-- Advertisments (12)
-- ========================= --

INSERT INTO advertisments (creator_id, title, description, point_cost, location_lat, location_lng, building_name, room_number, portions, path_to_picture, state_of_ad) VALUES
(1, 'Leftover Pizza from Club Meeting',        'About 8 slices of pepperoni and veggie pizza left over from the CS club meeting.',        2, 37.871900, -122.258500, 'Student Union',      '204', 8, '/uploads/ads/pizza.jpg',       'ACTIVE'),
(2, 'Extra Sushi Platters',                    'Two untouched sushi platters from a department seminar. Vegetarian rolls included.',      4, 37.872400, -122.259800, 'Engineering Hall',   '110', 6, '/uploads/ads/sushi.jpg',       'ACTIVE'),
(3, 'Bakery Surplus - Croissants',             'Fresh croissants from the campus bakery, baked this morning and unsold.',                 1, 37.870600, -122.257100, 'Campus Bakery',      'N/A', 12,'/uploads/ads/croissants.jpg',  'ACTIVE'),
(4, 'Vegetable Stir Fry - Cooking Class Extras','Large batch of vegetable stir fry made during today''s culinary elective.',               2, 37.873100, -122.260200, 'Home Economics Bldg','305', 10,'/uploads/ads/stirfry.jpg',     'ACTIVE'),
(1, 'Sandwich Platter from Seminar',           'Assorted sandwich halves left after a guest lecture, mostly turkey and hummus.',           2, 37.871900, -122.258520, 'Lecture Hall B',     '2',   5, '/uploads/ads/sandwiches.jpg',  'ACTIVE'),
(2, 'Fresh Fruit Bowls',                       'Pre-cut fruit bowls from a wellness fair, apples, grapes, and melon.',                     1, 37.872400, -122.259820, 'Recreation Center',  'Lobby',7, '/uploads/ads/fruit.jpg',       'ACTIVE'),
(3, 'Pasta Bake - Dorm Event Leftovers',       'Baked ziti from tonight''s dorm floor social, still warm.',                                3, 37.870600, -122.257120, 'Maple Hall',         'Common Room', 9, '/uploads/ads/pasta.jpg', 'ACTIVE'),
(4, 'Bagels & Cream Cheese',                   'Boxed bagels with a few tubs of cream cheese left from a morning meeting.',                1, 37.873100, -122.260220, 'Admin Building',     '112', 10,'/uploads/ads/bagels.jpg',      'INACTIVE'),
(1, 'Curry and Rice - Cultural Night',         'Chickpea curry and rice from the International Student Association cultural night.',      3, 37.871900, -122.258530, 'Global Center',      'Main Hall', 8, '/uploads/ads/curry.jpg', 'ACTIVE'),
(2, 'Soup and Bread - Charity Event',          'Vegetable soup and fresh bread rolls from tonight''s charity dinner.',                     2, 37.872400, -122.259830, 'Community Kitchen',  '1',   6, '/uploads/ads/soup.jpg',        'DELETED'),
(3, 'Cupcakes - Bake Sale Extras',             'Unsold cupcakes from the fundraiser bake sale, assorted flavors.',                         1, 37.870600, -122.257130, 'Student Union',      'Atrium', 15,'/uploads/ads/cupcakes.jpg',   'DELETED'),
(4, 'Falafel Wraps - Food Truck Leftovers',    'Falafel wraps that the food truck pop-up couldn''t sell before closing.',                  2, 37.873100, -122.260230, 'Quad',               'Food Truck Row', 5, '/uploads/ads/falafel.jpg', 'INACTIVE');

-- ========================= --
-- Allergens
-- ========================= --

INSERT INTO allergens (allergen_name, id) VALUES
('Gluten',   1),
('Dairy',    1),
('Fish',     2),
('Soy',      2),
('Gluten',   3),
('Dairy',    3),
('Soy',      4),
('Gluten',   5),
('Dairy',    6), -- (fruit bowl cross-contact note)
('Gluten',   7),
('Dairy',    7),
('Gluten',   8),
('Dairy',    8),
('Gluten',   9),
('Dairy',   10),
('Gluten',  10),
('Gluten',  11),
('Dairy',   11),
('Gluten',  12);

-- ========================= --
-- Requests
-- ========================= --

INSERT INTO requests (id, con_id, state_of_delivery, missedDeliveryPenalty, penalty_applied) VALUES
(1, 2, 'DELIVERED', FALSE, FALSE),
(2, 3, 'DELIVERED', FALSE, FALSE),
(3, 4, 'DELIVERED', FALSE, TRUE),
(4, 1, 'MISSED',    TRUE,  TRUE),
(5, 3, 'DELIVERED', FALSE, FALSE),
(6, 4, 'DELIVERED', FALSE, TRUE),
(7, 2, 'MISSED',    TRUE,  TRUE),
(9, 4, 'DELIVERED', FALSE, FALSE),
(12,1, 'DELIVERED', FALSE, TRUE);

-- Mark corresponding ads as delivered where the request succeeded
UPDATE advertisments SET date_of_delivery = ADDDATE(date_posted, INTERVAL 6 HOUR) WHERE id IN (1,2,3,5,6,9,12);

-- ========================= --
-- Ratings
-- ========================= --

INSERT INTO ratings (req_id, description) VALUES
(1, 'Pizza was still warm, great portion size, would grab again!'),
(2, 'Sushi was fresh and the pickup instructions were clear.'),
(3, 'Stir fry was good but pickup room was a bit hard to find.'),
(5, 'Fruit was fresh, appreciated the individual bowls.'),
(9, 'Curry had great flavor, generous portion for the point cost.');