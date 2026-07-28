import db from "../database/connection.js";

export function getAllOffers(req, res){
    const sql = `
        SELECT * 
        FROM advertisments
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Database error"
            });
        }
        if (results.length === 0) {
            return res.status(404).json({
                message: "No offers found"
            });
        }
        
        res.json(results);
    });
}

export function getOfferByTitle(req, res){
    const { title } = req.params;

    const sql = `
        SELECT * 
        FROM advertisments
        WHERE title LIKE CONCAT('%', ?, '%')
    `;

    db.query(sql, [title], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Database error"
            });
        }
        if (results.length === 0) {
            return res.status(404).json({
                message: "No offer found with the given title"
            });
        }
        
        res.json(results);
    });
}

export function createOffer(req, res) {
    const body = req.body || {};
    const {
        title,
        description,
        price,
        latitude,
        longitude,
        quality,
        path_to_picture,
        allergies,
        state_of_ad
    } = body;

    const parsedPrice = Number(price);
    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);
    const parsedQuality = Number(quality);

    if (!title || !description || Number.isNaN(parsedPrice)) {
        return res.status(400).json({
            message: "Title, description, and price are required"
        });
    }

    if (Number.isNaN(parsedLatitude) || Number.isNaN(parsedLongitude) || Number.isNaN(parsedQuality)) {
        return res.status(400).json({
            message: "Latitude, longitude, and quality must be valid numbers"
        });
    }

    const sql = `
        INSERT INTO advertisments (
            title,
            description,
            price,
            latitude,
            longitude,
            quality,
            path_to_picture,
            allergies,
            state_of_ad
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        title.trim(),
        description.trim(),
        parsedPrice,
        parsedLatitude,
        parsedLongitude,
        parsedQuality,
        path_to_picture || null,
        allergies || null,
        state_of_ad || "ACTIVE"
    ], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }

        res.status(201).json({
            success: true,
            message: "Offer created successfully",
            offerId: results.insertId
        });
    });
}
