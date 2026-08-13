import db from "../database/connection.js";

export async function getAllOffers(req, res) {
    const sql = `
        SELECT * 
        FROM advertisments
    `;

    try {
        const [results] = await db.query(sql);

        if (results.length === 0) {
            return res.status(404).json({
                message: "No offers found"
            });
        }

        return res.json(results);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Database error"
        });
    }
}

export async function getOfferExcludingUser(req, res) {
    const { userId } = req.params;

    const sql = `
        SELECT * 
        FROM advertisments
        WHERE creator_id != ?
    `;

    try {
        const [results] = await db.query(sql, [userId]);

        if (results.length === 0) {
            return res.status(404).json({
                message: "No offers found excluding the given user"
            });
        }

        return res.json(results);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Database error"
        });
    }
}

export async function getUserOffers(req, res) {
    const { userId } = req.params;

    const sql = `
        SELECT * 
        FROM advertisments
        WHERE creator_id = ?
    `;

    try {
        const [results] = await db.query(sql, [userId]);

        if (results.length === 0) {
            return res.status(404).json({
                message: "No offers found for the given user"
            });
        }

        return res.json(results);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Database error"
        });
    }
}

export async function getOfferByTitle(req, res) {
    const { title } = req.query;

    const sql = `
        SELECT * 
        FROM advertisments
        WHERE title LIKE CONCAT('%', ?, '%')
    `;

    try {
        const [results] = await db.query(sql, [title]);

        if (results.length === 0) {
            return res.status(404).json({
                message: "No offer found with the given title"
            });
        }

        return res.json(results);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Database error"
        });
    }
}



export async function createOffer(req, res) {
    const {
        creator_id,
        title,
        description,
        price,
        latitude,
        longitude,
        quantity,
        building_name,
        room_number
    } = req.body;


    const image = req.file;

    const path_to_image = image ? image.path : null;


    console.log(req.body);

    console.log(req.file);

    const parsedPrice = Number(price);
    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);
    const parsedQuantity = Number(quantity);
    const parsedBuildingName = String(building_name);
    const parsedRoomNumber = String(room_number);

    if (!parsedBuildingName || !parsedRoomNumber) {
        return res.status(400).json({
            message: "Building name and room number are required"
        });
    }

    if (!title || !description || Number.isNaN(parsedPrice)) {
        return res.status(400).json({
            message: "Title, description, and price are required"
        });
    }

    if (!creator_id) {
        return res.status(400).json({
            message: "creator_id is required"
        });
    }

    if (Number.isNaN(parsedLatitude) || Number.isNaN(parsedLongitude) || Number.isNaN(parsedQuantity)) {
        return res.status(400).json({
            message: "Latitude, longitude, and quantity must be valid numbers"
        });
    }

    const sql = `
        INSERT INTO advertisments (
            creator_id,
            title,
            description,
            price,
            latitude,
            longitude,
            quantity,
            building_name,
            room_number,
            path_to_picture,
            state_of_ad
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        const [results] = await db.query(sql, [
            creator_id,
            title.trim(),
            description.trim(),
            parsedPrice,
            parsedLatitude,
            parsedLongitude,
            parsedQuantity,
            parsedBuildingName.trim(),
            parsedRoomNumber.trim(),
            path_to_image,
            "ACTIVE"
        ]);

        return res.status(201).json({
            success: true,
            message: "Offer created successfully",
            offerId: results.insertId
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Database error",
            error: err.message
        });
    }
}
