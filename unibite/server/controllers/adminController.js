import db from "../database/connection.js";

export async function loginAdmin(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const sql = `
        SELECT *
        FROM admins
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

        const admin = results[0];

        return res.json({
            success: true,
            admin: {
                admin_id: admin.admin_id,
                username: admin.username,
                email: admin.email,
                created_at: admin.created_at
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Database error"
        });
    }
}

export async function getDashboardStats(req, res) {
    const statsQuery = `
        SELECT
            (SELECT COALESCE(SUM(portions_given), 0) FROM users) AS total_portions,
            (SELECT COUNT(*) FROM advertisments WHERE state_of_ad = 'ACTIVE') AS active_ads,
            (SELECT COUNT(*) FROM users) AS total_users
    `;

    const leaderboardQuery = `
        SELECT id, name, portions_given, points
        FROM users
        ORDER BY portions_given DESC, points DESC
        LIMIT 5
    `;

    try {
        const [statsResults] = await db.query(statsQuery);
        const [leaderboardResults] = await db.query(leaderboardQuery);

        return res.json({
            success: true,
            stats: statsResults[0],
            leaderboard: leaderboardResults.map((user) => ({
                name: user.name,
                portions: user.portions_given,
                rating: user.points
            }))
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Database error"
        });
    }
}