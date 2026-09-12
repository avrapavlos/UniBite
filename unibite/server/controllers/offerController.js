import db from "../database/connection.js";
import { canAcceptClaim, canClaimOffer } from "./offerClaimLogic.js";

function normalizeOffer(offer) {
    return {
        id: offer.id ?? offer.id,
        creator_id: offer.creator_id,
        title: offer.title,
        description: offer.description,
        quantity: offer.quantity ?? offer.portions ?? 0,
        price: offer.price ?? offer.point_cost ?? 0,
        latitude: offer.latitude ?? offer.location_lat ?? null,
        longitude: offer.longitude ?? offer.location_lng ?? null,
        path_to_picture: offer.path_to_picture ?? offer.path_to_picture ?? null,
        building_name: offer.building_name ?? offer.building_name ?? null,
        room_number: offer.room_number ?? offer.room_number ?? null,
        date_posted: offer.date_posted ?? offer.pickup_time ?? offer.date_posted ?? null,
        allergens: offer.allergen_names
            ? offer.allergen_names.split(",")
            : []
    };
}

// Normalizes the "allergies" field from a multipart/form submission into a
// clean array of non-empty strings. When only one checkbox is checked,
// multer/busboy delivers a single string instead of an array.
function normalizeAllergiesInput(rawAllergies) {
    if (!rawAllergies) return [];
    const list = Array.isArray(rawAllergies) ? rawAllergies : [rawAllergies];
    return list.map((value) => String(value).trim()).filter(Boolean);
}

async function saveOfferAllergens(offerId, allergies) {
    if (!allergies || allergies.length === 0) return;

    const values = allergies.map((allergenName) => [allergenName, offerId]);

    await db.query(
        `INSERT IGNORE INTO allergens (allergen_name, id) VALUES ?`,
        [values]
    );
}

export async function getAllOffers(req, res) {
    const sql = `
        SELECT a.*, GROUP_CONCAT(al.allergen_name) AS allergen_names
        FROM advertisments a
        LEFT JOIN allergens al ON al.id = a.id
        WHERE a.portions > 0
        GROUP BY a.id
        ORDER BY a.date_posted DESC
    `;

    try {
        const [results] = await db.query(sql);

        if (results.length === 0) {
            return res.status(404).json({ message: "No offers found" });
        }

        return res.json(results.map(normalizeOffer));
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
    }
}

export async function getOfferExcludingUser(req, res) {
    console.log("getOfferExcludingUser called with params:", req.params);

    const { userId } = req.params;

    const sql = `
        SELECT a.*, GROUP_CONCAT(al.allergen_name) AS allergen_names
        FROM advertisments a
        LEFT JOIN allergens al ON al.id = a.id
        WHERE a.creator_id != ? AND a.portions > 0
        GROUP BY a.id
        ORDER BY a.date_posted DESC
    `;

    try {
        const [results] = await db.query(sql, [userId]);
        return res.json(results.map(normalizeOffer));
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
    }
}

export async function getUserOffers(req, res) {
    const { userId } = req.params;

    const sql = `
        SELECT a.*, GROUP_CONCAT(al.allergen_name) AS allergen_names
        FROM advertisments a
        LEFT JOIN allergens al ON al.id = a.id
        WHERE a.creator_id = ? AND a.portions > 0
        GROUP BY a.id
        ORDER BY a.date_posted DESC
    `;

    try {
        const [results] = await db.query(sql, [userId]);
        return res.json(results.map(normalizeOffer));
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
    }
}

export async function getOfferByTitle(req, res) {
    const { title } = req.query;

    const sql = `SELECT * FROM advertisments WHERE title LIKE CONCAT('%', ?, '%')`;

    try {
        const [results] = await db.query(sql, [title]);
        return res.json(results.map(normalizeOffer));
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
    }
}

export async function getOfferClaims(req, res) {
    const { offerId } = req.params;

    const sql = `
        SELECT r.*, u.name AS claimant_name, u.username AS claimant_username
        FROM requests r
        LEFT JOIN users u ON u.id = r.con_id
        WHERE r.id = ?
        ORDER BY r.date_posted DESC
    `;

    try {
        const [results] = await db.query(sql, [offerId]);
        return res.json(results);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
    }
}

export async function getUserClaims(req, res) {
    const { userId } = req.params;

    const sql = `
        SELECT r.*, o.id AS offer_id, o.title AS offer_title, u.name AS claimant_name, u.username AS claimant_username
        FROM requests r
        JOIN advertisments o ON o.id = r.id
        JOIN users u ON u.id = r.con_id
        WHERE o.creator_id = ?
        ORDER BY r.date_posted DESC
    `;

    try {
        const [results] = await db.query(sql, [userId]);
        const claimsByOffer = {};

        for (const claim of results) {
            if (!claimsByOffer[claim.id]) {
                claimsByOffer[claim.id] = [];
            }
            claimsByOffer[claim.id].push(claim);
        }

        return res.json(claimsByOffer);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
    }
}

export async function getUserClaimedOffers(req, res) {
    const { userId } = req.params;

    const sql = `
            SELECT
                r.request_id,
                r.id AS id,
                r.con_id,
                r.status,
                r.state_of_delivery,
                r.claimed_portions,
                r.date_posted AS claim_date_posted,
                o.title,
                o.description,
                o.portions AS quantity,
                o.point_cost AS price,
                o.location_lat AS latitude,
                o.location_lng AS longitude,
                o.building_name,
                o.room_number,
                o.path_to_picture,
                u.name AS creator_name,
                u.id AS creator_id,
                rating.score AS rating_score,
                rating.comment AS rating_comment
            FROM requests r
            JOIN advertisments o ON o.id = r.id
            JOIN users u ON u.id = o.creator_id
            LEFT JOIN ratings rating ON rating.req_id = r.request_id
                AND rating.rater_id = r.con_id
            WHERE r.con_id = ?
            ORDER BY r.date_posted DESC
        `;

    try {
        const [results] = await db.query(sql, [userId]);
        return res.json(results);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
    }
}

export async function claimOffer(req, res) {
    const { offerId } = req.params;
    const { userId, claimedPortions = 1 } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "userId is required" });
    }

    const requestedPortions = Number(claimedPortions);
    if (!Number.isFinite(requestedPortions) || requestedPortions <= 0) {
        return res.status(400).json({ message: "claimedPortions must be a positive number" });
    }

    try {
        const [offerResults] = await db.query(`SELECT * FROM advertisments WHERE id = ?`, [offerId]);
        if (offerResults.length === 0) {
            return res.status(404).json({ message: "Offer not found" });
        }

        const offer = offerResults[0];
        if (Number(offer.creator_id) === Number(userId)) {
            return res.status(403).json({ message: "You cannot claim your own offer." });
        }

        const [existingClaims] = await db.query(
            `SELECT * FROM requests WHERE id = ? AND con_id = ? AND status IN ('PENDING', 'ACCEPTED')`,
            [offerId, userId]
        );

        if (existingClaims.length > 0) {
            return res.status(409).json({ message: "You already have an active claim for this offer." });
        }

        const [acceptedResults] = await db.query(
            `SELECT COALESCE(SUM(claimed_portions), 0) AS total_accepted FROM requests WHERE id = ? AND status = 'ACCEPTED'`,
            [offerId]
        );

        const totalAccepted = Number(acceptedResults[0]?.total_accepted || 0);
        const remaining = Math.max(Number(offer.portions || 0) - totalAccepted, 0);

        if (remaining < requestedPortions) {
            return res.status(400).json({
                success: false,
                message: "Not enough portions remain for this claim."
            });
        }

        const claimEligible = canClaimOffer(offer, userId, existingClaims, requestedPortions);
        if (!claimEligible) {
            return res.status(400).json({
                success: false,
                message: "This offer cannot accept that claim right now."
            });
        }

        const [insertResult] = await db.query(
            `INSERT INTO requests (id, con_id, claimed_portions, status, date_posted) VALUES (?, ?, ?, 'PENDING', NOW())`,
            [offerId, userId, requestedPortions]
        );

        return res.status(201).json({
            success: true,
            message: "Claim submitted successfully.",
            requestId: insertResult.insertId
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error", error: err.message });
    }
}

export async function acceptOfferClaim(req, res) {
    const { offerId, requestId } = req.params;
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "userId is required" });
    }

    try {
        await db.beginTransaction();

        const [claimResults] = await db.query(
            `SELECT r.*, o.creator_id, o.portions, o.point_cost
             FROM requests r
             JOIN advertisments o ON o.id = r.id
             WHERE r.request_id = ? AND r.id = ?
             FOR UPDATE`,
            [requestId, offerId]
        );

        if (claimResults.length === 0) {
            await db.rollback();
            return res.status(404).json({ message: "Claim not found" });
        }

        const claim = claimResults[0];
        if (Number(claim.creator_id) !== Number(userId)) {
            await db.rollback();
            return res.status(403).json({ message: "Only the offer creator can accept this claim." });
        }

        if (claim.status === "ACCEPTED") {
            await db.commit();
            return res.json({ success: true, message: "Claim is already accepted." });
        }

        const acceptedCount = Number(claim.claimed_portions || 1);
        const remaining = Number(claim.portions || 0);

        if (remaining < acceptedCount) {
            await db.rollback();
            return res.status(400).json({ message: "This claim exceeds the remaining offer quantity." });
        }

        const canAccept = canAcceptClaim({ creator_id: claim.creator_id }, claim, userId);
        if (!canAccept) {
            await db.rollback();
            return res.status(403).json({ message: "This claim cannot be accepted." });
        }

        const totalCost = Number(claim.point_cost || 0) * acceptedCount;
        const [claimantResults] = await db.query(
            `SELECT id, points FROM users WHERE id = ? FOR UPDATE`,
            [claim.con_id]
        );

        if (claimantResults.length === 0) {
            await db.rollback();
            return res.status(404).json({ message: "Claimant not found." });
        }

        if (Number(claimantResults[0].points || 0) < totalCost) {
            await db.rollback();
            return res.status(400).json({ message: "The claimant does not have enough funds." });
        }

        await db.query(
            `UPDATE users SET points = points - ? WHERE id = ?`,
            [totalCost, claim.con_id]
        );

        await db.query(
            `UPDATE requests SET status = 'ACCEPTED', accepted_at = NOW(), updated_at = NOW() WHERE request_id = ?`,
            [requestId]
        );

        await db.query(
            `UPDATE advertisments SET portions = GREATEST(portions - ?, 0) WHERE id = ?`,
            [Number(claim.claimed_portions || 1), offerId]
        );

        await db.commit();

        return res.json({ success: true, message: "Claim accepted.", charged: totalCost });
    } catch (err) {
        await db.rollback();
        console.error(err);
        return res.status(500).json({ message: "Database error", error: err.message });
    }
}

export async function markClaimMissed(req, res) {
    const { offerId, requestId } = req.params;
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "userId is required" });
    }

    try {
        await db.beginTransaction();
        const [claimResults] = await db.query(
            `SELECT r.*, o.creator_id
             FROM requests r
             JOIN advertisments o ON o.id = r.id
             WHERE r.request_id = ? AND r.id = ?
             FOR UPDATE`,
            [requestId, offerId]
        );

        if (claimResults.length === 0) {
            await db.rollback();
            return res.status(404).json({ message: "Claim not found" });
        }

        const claim = claimResults[0];
        if (Number(claim.creator_id) !== Number(userId)) {
            await db.rollback();
            return res.status(403).json({ message: "Only the offer creator can mark this claim missed." });
        }

        if (claim.status !== "ACCEPTED") {
            await db.rollback();
            return res.status(400).json({ message: "Only accepted claims can be marked missed." });
        }

        if (claim.state_of_delivery === "MISSED" || claim.missedDeliveryPenalty) {
            await db.commit();
            return res.json({ success: true, message: "Claim was already marked missed." });
        }

        await db.query(
            `UPDATE users SET points = GREATEST(points - 1, 0) WHERE id = ?`,
            [claim.con_id]
        );
        await db.query(
            `UPDATE requests
             SET state_of_delivery = 'MISSED', missedDeliveryPenalty = TRUE,
                 penalty_applied = TRUE, updated_at = NOW()
             WHERE request_id = ?`,
            [requestId]
        );

        await db.commit();
        return res.json({ success: true, message: "Claim marked as not picked up.", charged: 1 });
    } catch (err) {
        await db.rollback();
        console.error(err);
        return res.status(500).json({ message: "Database error", error: err.message });
    }
}

export async function rejectOfferClaim(req, res) {
    const { offerId, requestId } = req.params;
    const { userId } = req.body;

    try {
        const [claimResults] = await db.query(
            `SELECT r.*, o.creator_id FROM requests r JOIN advertisments o ON o.id = r.id WHERE r.request_id = ? AND r.id = ?`,
            [requestId, offerId]
        );

        if (claimResults.length === 0) {
            return res.status(404).json({ message: "Claim not found" });
        }

        const claim = claimResults[0];
        if (Number(claim.creator_id) !== Number(userId)) {
            return res.status(403).json({ message: "Only the offer creator can reject this claim." });
        }

        await db.query(
            `UPDATE requests SET status = 'REJECTED', rejected_at = NOW(), updated_at = NOW() WHERE request_id = ?`,
            [requestId]
        );

        return res.json({ success: true, message: "Claim rejected." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error", error: err.message });
    }
}

export async function rateClaim(req, res) {
    const { requestId } = req.params;
    const { raterId, score, comment = "" } = req.body;

    if (!raterId) {
        return res.status(400).json({ message: "raterId is required" });
    }

    const rating = Number(score);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "score must be between 1 and 5" });
    }

    try {
        const [claimResults] = await db.query(
            `SELECT r.*, o.creator_id FROM requests r JOIN advertisments o ON o.id = r.id WHERE r.request_id = ? AND r.status = 'ACCEPTED'`,
            [requestId]
        );

        if (claimResults.length === 0) {
            return res.status(404).json({ message: "Only accepted claims can be rated." });
        }

        const claim = claimResults[0];
        const validRater = Number(raterId) === Number(claim.con_id);
        if (!validRater) {
            return res.status(403).json({ message: "Only the claimant can rate this request." });
        }

        const ratedUserId = Number(claim.creator_id);
        const claimedPortions = Number(claim.claimed_portions || 1);
        const [existingMarks] = await db.query(
            `SELECT * FROM ratings WHERE req_id = ? AND rater_id = ?`,
            [requestId, raterId]
        );

        if (existingMarks.length > 0) {
            await db.query(
                `UPDATE ratings SET score = ?, comment = ?, rated_user_id = ? WHERE req_id = ? AND rater_id = ?`,
                [rating, comment.trim(), ratedUserId, requestId, raterId]
            );
        } else {
            await db.query(
                `INSERT INTO ratings (req_id, rater_id, rated_user_id, score, comment) VALUES (?, ?, ?, ?, ?)`,
                [requestId, raterId, ratedUserId, rating, comment.trim()]
            );
        }

        const previousRating = Number(existingMarks[0]?.score || 0);
        const previousReward = previousRating > 0
            ? (previousRating > 3 ? 2 : 1) * claimedPortions
            : 0;
        const newReward = (rating > 3 ? 2 : 1) * claimedPortions;
        await db.query(
            `UPDATE users SET points = points + ? WHERE id = ?`,
            [newReward - previousReward, ratedUserId]
        );

        return res.json({
            success: true,
            message: "Rating submitted.",
            rating: {
                score: rating,
                reward: newReward - previousReward
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error", error: err.message });
    }
}

export async function createOffer(req, res) {
    const { creator_id, title, description, price, latitude, longitude, quantity, building_name, room_number, allergies } = req.body;
    const image = req.file;
    const path_to_image = image ? `/uploads/offers/${image.filename}` : null;

    if (!building_name || !room_number) {
        return res.status(400).json({ message: "Building name and room number are required" });
    }

    const parsedPrice = Number(price);
    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);
    const parsedQuantity = Number(quantity);
    const parsedBuildingName = String(building_name);
    const parsedRoomNumber = String(room_number);
    const parsedAllergies = normalizeAllergiesInput(allergies);

    if (!parsedBuildingName || !parsedRoomNumber) {
        return res.status(400).json({ message: "Building name and room number are required" });
    }

    if (!title || !description || Number.isNaN(parsedPrice)) {
        return res.status(400).json({ message: "Title, description, and price are required" });
    }

    if (!creator_id) {
        return res.status(400).json({ message: "creator_id is required" });
    }

    if (Number.isNaN(parsedLatitude) || Number.isNaN(parsedLongitude) || Number.isNaN(parsedQuantity)) {
        return res.status(400).json({ message: "Latitude, longitude, and quantity must be valid numbers" });
    }

    const sql = `
        INSERT INTO advertisments (
            creator_id,
            title,
            description,
            portions,
            location_lat,
            location_lng,
            building_name,
            room_number,
            path_to_picture,
            point_cost
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            path_to_image,
            parsedPrice
        ]);

        await saveOfferAllergens(results.insertId, parsedAllergies);

        return res.status(201).json({ success: true, message: "Offer created successfully", offerId: results.insertId });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error", error: err.message });
    }
}

export async function updateOffer(req, res) {
    const { offerId } = req.params;
    const { userId, title, description, price, latitude, longitude, quantity, building_name, room_number, allergies } = req.body;
    const image = req.file;
    const path_to_image = image ? `/uploads/offers/${image.filename}` : null;

    if (!userId) {
        return res.status(400).json({ message: "userId is required" });
    }

    const sqlCheckOwnership = `SELECT * FROM advertisments WHERE id = ? AND creator_id = ?`;

    try {
        const [ownershipResults] = await db.query(sqlCheckOwnership, [offerId, userId]);
        if (ownershipResults.length === 0) {
            return res.status(403).json({ message: "You do not have permission to update this offer" });
        }

        const currentOffer = ownershipResults[0];
        const nextTitle = title ?? currentOffer.title;
        const nextDescription = description ?? currentOffer.description;
        const nextPrice = price !== undefined ? Number(price) : Number(currentOffer.point_cost);
        const nextLatitude = latitude !== undefined ? Number(latitude) : Number(currentOffer.location_lat);
        const nextLongitude = longitude !== undefined ? Number(longitude) : Number(currentOffer.location_lng);
        const nextQuantity = quantity !== undefined ? Number(quantity) : Number(currentOffer.portions);
        const nextBuildingName = building_name ?? currentOffer.building;
        const nextRoomNumber = room_number ?? currentOffer.room;

        if (!nextTitle || !nextDescription || Number.isNaN(nextPrice) || Number.isNaN(nextLatitude) || Number.isNaN(nextLongitude) || Number.isNaN(nextQuantity) || !nextBuildingName || !nextRoomNumber) {
            return res.status(400).json({ message: "Submitted offer data is incomplete or invalid" });
        }

        const sql = `
            UPDATE offers
            SET title = ?, description = ?, point_cost = ?, location_lat = ?, location_lng = ?, portions = ?, building_name = ?, room_number = ?, path_to_picture = ?
            WHERE id = ?
        `;

        const [results] = await db.query(sql, [
            nextTitle.trim(),
            nextDescription.trim(),
            nextPrice,
            nextLatitude,
            nextLongitude,
            nextQuantity,
            nextBuildingName.trim(),
            nextRoomNumber.trim(),
            path_to_path_to_picture ?? currentOffer.path_to_picture,
            offerId
        ]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Offer not found" });
        }

        if (allergies !== undefined) {
            const nextAllergies = normalizeAllergiesInput(allergies);
            await db.query(`DELETE FROM allergens WHERE id = ?`, [offerId]);
            await saveOfferAllergens(offerId, nextAllergies);
        }

        return res.json({ success: true, message: "Offer updated successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error", error: err.message });
    }
}

export async function deleteOffer(req, res) {
    const { offerId } = req.params;
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "userId is required" });
    }

    const sqlCheckOwnership = `SELECT * FROM advertisments WHERE id = ? AND creator_id = ?`;

    try {
        const [ownershipResults] = await db.query(sqlCheckOwnership, [offerId, userId]);
        if (ownershipResults.length === 0) {
            return res.status(403).json({ message: "You do not have permission to delete this offer" });
        }

        // Check if the offer has any active claims
        const [activeClaims] = await db.query(
            `SELECT COUNT(*) AS count FROM requests WHERE id = ? AND status IN ('PENDING', 'ACCEPTED')`,
            [offerId]
        );

        if (activeClaims[0].count > 0) {
            return res.status(400).json({
                message: "This offer has active claims and cannot be deleted. Reject or resolve the claims first."
            });
        }

        const sql = `DELETE FROM advertisments WHERE id = ?`;

        const [results] = await db.query(sql, [offerId]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Offer not found" });
        }

        return res.json({ success: true, message: "Offer deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error", error: err.message });
    }
}