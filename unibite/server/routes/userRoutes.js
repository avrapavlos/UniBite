// unibite/server/routes/userRoutes.js

import express from "express";
import db from "../database/connection.js";

const router = express.Router();

router.post("/location", async (req, res) => {
    const { userId, latitude, longitude } = req.body;
    const parsedUserId = Number(userId);
    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);

    if (!Number.isInteger(parsedUserId) || parsedUserId <= 0
        || !Number.isFinite(parsedLatitude) || parsedLatitude < -90 || parsedLatitude > 90
        || !Number.isFinite(parsedLongitude) || parsedLongitude < -180 || parsedLongitude > 180) {
        return res.status(400).json({ error: "A valid userId, latitude, and longitude are required" });
    }

    try {
        const [result] = await db.query(
            "UPDATE users SET latitude = ?, longitude = ? WHERE id = ?",
            [parsedLatitude, parsedLongitude, parsedUserId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            message: "Location updated successfully",
            userId: parsedUserId,
            latitude: parsedLatitude,
            longitude: parsedLongitude
        });

    } catch (error) {
        console.error("Database error updating location:", error);
        res.status(500).json({ error: "Failed to update location" });
    }
});

export default router;