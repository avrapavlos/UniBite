import db from "../database/connection.js";

function normalizeOffer(offer) {
    return {
        id: offer.id ?? offer.ad_id,
        creator_id: offer.creator_id,
        title: offer.title,
        description: offer.description,
        quantity: offer.quantity ?? offer.portions ?? 0,
        price: offer.price ?? offer.point_cost ?? 0,
        latitude: offer.latitude ?? offer.location_lat ?? null,
        longitude: offer.longitude ?? offer.location_lng ?? null,
        image: offer.image ?? offer.path_to_picture ?? null,
        building_name: offer.building_name ?? offer.building ?? null,
        room_number: offer.room_number ?? offer.room ?? null,
        date_posted: offer.date_posted ?? offer.pickup_time ?? offer.created_at ?? null,
        created_at: offer.created_at ?? offer.date_posted ?? null
    };
}

export async function getAllOffers(req, res) {
    const sql = `
        SELECT * 
        FROM offers
    `;

    try {
        const [results] = await db.query(sql);

        if (results.length === 0) {
            return res.status(404).json({
                message: "No offers found"
            });
        }

        return res.json(results.map(normalizeOffer));
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
        FROM offers
        WHERE creator_id != ?
    `;

    try {
        const [results] = await db.query(sql, [userId]);

        if (results.length === 0) {
            return res.status(404).json({
                message: "No offers found excluding the given user"
            });
        }

        return res.json(results.map(normalizeOffer));
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
        FROM offers
        WHERE creator_id = ?
    `;

    try {
        const [results] = await db.query(sql, [userId]);

        if (results.length === 0) {
            return res.status(404).json({
                message: "No offers found for the given user"
            });
        }

        return res.json(results.map(normalizeOffer));
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
        FROM offers
        WHERE title LIKE CONCAT('%', ?, '%')
    `;

    try {
        const [results] = await db.query(sql, [title]);

        if (results.length === 0) {
            return res.status(404).json({
                message: "No offer found with the given title"
            });
        }

        return res.json(results.map(normalizeOffer));
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

    if (!building_name || !room_number) {
        return res.status(400).json({
            message: "Building name and room number are required"
        });
    }

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
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        const [results] = await db.query(sql, [
            creator_id,
            title.trim(),
            description.trim(),
            parsedQuantity,
            parsedLatitude,
            parsedLongitude,
            parsedBuildingName.trim(),
            parsedRoomNumber.trim(),
            new Date().toISOString().slice(0, 19).replace('T', ' '),
            "",
            0,
            path_to_image,
            parsedPrice
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
