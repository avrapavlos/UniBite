import db from "../database/connection.js";

export function getAllOffers(req, res){
    const sql = `
        SELECT * 
        FROM offers
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
        FROM offers
        WHERE title = ?
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
        const { title, description, price } = req.body;
    
        if (!title || !description || !price) {
            return res.status(400).json({
                message: "Title, description, and price are required"
            });
        }
    
        const sql = `
            INSERT INTO offers (title, description, price)
            VALUES (?, ?, ?)
        `;
    
        db.query(sql, [title, description, price], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Database error"
                });
            }
    
            res.status(201).json({
                success: true,
                message: "Offer created successfully",
                offerId: results.insertId
            });
        });
    }
