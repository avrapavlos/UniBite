USE unibite;

INSERT INTO advertisments
(
    creator_id,
    title,
    description,
    point_cost,
    date_posted,
    date_of_delivery,
    location_lat,
    location_lng,
    building_name,
    room_number,
    portions,
    path_to_picture,
    state_of_ad
)
VALUES
(
    (SELECT id FROM users WHERE username = 'alex_papadopoulos'),
    'Vegetable pasta',
    'Fresh vegetable pasta with tomato sauce.',
    5,
    CURRENT_TIMESTAMP,
    DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 2 DAY),
    39.475000,
    21.920000,
    'Main Campus',
    'A101',
    2,
    'vegetable-pasta.jpg',
    'ACTIVE'
);
SET @vegetable_pasta_id = LAST_INSERT_ID();

INSERT INTO advertisments
(
    creator_id,
    title,
    description,
    point_cost,
    date_posted,
    date_of_delivery,
    location_lat,
    location_lng,
    building_name,
    room_number,
    portions,
    path_to_picture,
    state_of_ad
)
VALUES
(
    (SELECT id FROM users WHERE username = 'maria_kosta'),
    'Homemade lentil soup',
    'Two portions of homemade lentil soup with bread.',
    3,
    CURRENT_TIMESTAMP,
    DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY),
    39.476000,
    21.921000,
    'Science Building',
    'B204',
    2,
    'lentil-soup.jpg',
    'INACTIVE'
);
SET @lentil_soup_id = LAST_INSERT_ID();

INSERT INTO advertisments
(
    creator_id,
    title,
    description,
    point_cost,
    date_posted,
    date_of_delivery,
    location_lat,
    location_lng,
    building_name,
    room_number,
    portions,
    path_to_picture,
    state_of_ad
)
VALUES
(
    (SELECT id FROM users WHERE username = 'elena_papadaki'),
    'Cheese and spinach pie',
    'Homemade cheese and spinach pie, available this afternoon.',
    4,
    CURRENT_TIMESTAMP,
    DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY),
    39.475500,
    21.920500,
    'Library',
    'C012',
    3,
    'spinach-pie.jpg',
    'DELETED'
);
SET @spinach_pie_id = LAST_INSERT_ID();

INSERT INTO advertisments
(
    creator_id,
    title,
    description,
    point_cost,
    date_posted,
    date_of_delivery,
    location_lat,
    location_lng,
    building_name,
    room_number,
    portions,
    path_to_picture,
    state_of_ad
)
VALUES
(
    (SELECT id FROM users WHERE username = 'nikos_georgiou'),
    'Rice with vegetables',
    'A vegetarian rice meal with mixed vegetables.',
    2,
    CURRENT_TIMESTAMP,
    DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 DAY),
    39.474500,
    21.919500,
    'Student Centre',
    'D105',
    1,
    NULL,
    'ACTIVE'
);
SET @vegetable_rice_id = LAST_INSERT_ID();

INSERT INTO allergens (allergen_name, id)
VALUES
    ('Gluten', @vegetable_pasta_id),
    ('Dairy', @vegetable_pasta_id),
    ('Celery', @lentil_soup_id),
    ('Gluten', @lentil_soup_id),
    ('Dairy', @spinach_pie_id),
    ('None declared', @vegetable_rice_id);

INSERT INTO requests
(
    id,
    con_id,
    state_of_delivery,
    missedDeliveryPenalty,
    penalty_applied,
    status,
    accepted_at
)
VALUES
(
    @vegetable_pasta_id,
    (SELECT id FROM users WHERE username = 'maria_kosta'),
    'DELIVERED',
    FALSE,
    FALSE,
    'ACCEPTED',
    CURRENT_TIMESTAMP
);
SET @pasta_request_id = LAST_INSERT_ID();

INSERT INTO requests
(
    id,
    con_id,
    state_of_delivery,
    missedDeliveryPenalty,
    penalty_applied,
    status,
    accepted_at
)
VALUES
(
    @lentil_soup_id,
    (SELECT id FROM users WHERE username = 'nikos_georgiou'),
    'MISSED',
    TRUE,
    TRUE,
    'ACCEPTED',
    DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)
);
SET @soup_request_id = LAST_INSERT_ID();

INSERT INTO requests
(
    id,
    con_id,
    state_of_delivery,
    missedDeliveryPenalty,
    penalty_applied,
    status,
    accepted_at
)
VALUES
(
    @spinach_pie_id,
    (SELECT id FROM users WHERE username = 'sofia_nikolaou'),
    'DELIVERED',
    FALSE,
    TRUE,
    'ACCEPTED',
    DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY)
);
SET @pie_request_id = LAST_INSERT_ID();

INSERT INTO requests
(
    id,
    con_id,
    state_of_delivery,
    missedDeliveryPenalty,
    penalty_applied,
    status,
    accepted_at
)
VALUES
(
    @vegetable_rice_id,
    (SELECT id FROM users WHERE username = 'anna_dimitriou'),
    'DELIVERED',
    FALSE,
    FALSE,
    'ACCEPTED',
    CURRENT_TIMESTAMP
);
SET @rice_request_id = LAST_INSERT_ID();

INSERT INTO ratings (req_id, score, description)
VALUES
    (@pasta_request_id, 4, 'The meal was fresh and well prepared.'),
    (@soup_request_id, 2, 'The delivery was missed.'),
    (@pie_request_id, 5, 'Great portion and very tasty.');

INSERT IGNORE INTO admins (username, password, email)
VALUES
    ('admin_demo', 'admin_demo_password', 'admin.demo@example.com'),
    ('moderator_demo', 'moderator_demo_password', 'moderator.demo@example.com');