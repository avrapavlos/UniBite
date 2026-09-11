// unibite/server/routes/userRoutes.js

import express from "express";
import db from "../database/connection.js";

const router = express.Router();

router.post("/location", async (req, res) => {
    const { userId, latitude, longitude } = req.body;

    if (!userId || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ error: "Missing userId, latitude, or longitude" });
    }

    try {
        await db.query(
            "UPDATE users SET latitude = ?, longitude = ? WHERE id = ?",
            [latitude, longitude, userId]
        );

        res.status(200).json({ message: "Location updated successfully" });

    } catch (error) {
        console.error("Database error updating location:", error);
        res.status(500).json({ error: "Failed to update location" });
    }
});

export default router;