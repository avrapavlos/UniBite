import db from "../database/connection.js";

// Login Function
export async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const sql = `
        SELECT *
        FROM users
        WHERE email = ?
        AND password = ?
    `;

    try {
        const [results] = await db.query(sql, [email, password]);

        if (results.length === 0) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const user = results[0];

        return res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                points: user.points,
                portions_given: user.portions_given,
                portions_received: user.portions_received,
                profile_pic: user.profile_pic,
                latitude: user.latitude,
                longitude: user.longitude
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Database error"
        });
    }
}

// Register function
export async function register(req, res) {
    const { name, email, password } = req.body;

    if (!name) {
        return res.status(400).json({
            message: "Name is required!"
        });
    }

    if (!email) {
        return res.status(400).json({
            message: "Email is required!"
        });
    }

    if (!password) {
        return res.status(400).json({
            message: "Password is required!"
        });
    }

    const checkDuplicateQuery = `
        SELECT *
        FROM users
        WHERE username = ?
        OR email = ?
    `;

    try {
        const [duplicateResults] = await db.query(checkDuplicateQuery, [name, email]);

        if (duplicateResults.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email or name already used!"
            });
        }

        const insertUserQuery = `
            INSERT INTO users (username, email, password, name, points)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [insertResult] = await db.query(insertUserQuery, [name, email, password, name, 50]);

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: insertResult.insertId,
                username: name,
                name,
                email,
                points: 50,
                portions_given: 0,
                portions_received: 0,
                profile_pic: null,
                latitude: null,
                longitude: null
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Database error"
        });
    }
}
