import db from "../database/connection.js";
import { createAdminToken } from "../middleware/adminAuth.js";

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
            token: createAdminToken(admin.admin_id),
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
            (SELECT COALESCE(SUM(claimed_portions), 0)
             FROM requests
             WHERE status = 'ACCEPTED'
               AND state_of_delivery = 'DELIVERED'
               AND accepted_at >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 MONTH)) AS total_portions,
            (SELECT COUNT(*) FROM advertisments WHERE state_of_ad = 'ACTIVE') AS active_ads,
            (SELECT COUNT(*) FROM users) AS total_users
    `;

    const leaderboardQuery = `
        SELECT u.id, u.name, COALESCE(SUM(r.claimed_portions), 0) AS portions_given
        FROM users u
        LEFT JOIN advertisments a ON a.creator_id = u.id
        LEFT JOIN requests r ON r.id = a.id
            AND r.status = 'ACCEPTED'
            AND r.state_of_delivery = 'DELIVERED'
        GROUP BY u.id, u.name
        ORDER BY portions_given DESC, u.points DESC
        LIMIT 5
    `;

    const highestRatedMealsQuery = `
        SELECT a.id, a.title, u.name AS donor_name,
               ROUND(AVG(rating.score), 1) AS average_rating,
               COUNT(rating.rating_id) AS rating_count
        FROM ratings rating
        INNER JOIN requests r ON r.request_id = rating.req_id
        INNER JOIN advertisments a ON a.id = r.id
        INNER JOIN users u ON u.id = a.creator_id
        WHERE rating.score BETWEEN 1 AND 5
        GROUP BY a.id, a.title, u.name
        ORDER BY average_rating DESC, rating_count DESC, a.title ASC
        LIMIT 5
    `;

    try {
        const [statsResults] = await db.query(statsQuery);
        const [leaderboardResults] = await db.query(leaderboardQuery);
        const [highestRatedMealsResults] = await db.query(highestRatedMealsQuery);

        return res.json({
            success: true,
            stats: statsResults[0],
            leaderboard: leaderboardResults.map((user) => ({
                name: user.name,
                portions: user.portions_given
            })),
            topDonor: leaderboardResults[0]
                ? {
                    name: leaderboardResults[0].name,
                    portions: leaderboardResults[0].portions_given
                }
                : null,
            highestRatedMeals: highestRatedMealsResults.map((meal) => ({
                title: meal.title,
                donorName: meal.donor_name,
                averageRating: meal.average_rating,
                ratingCount: meal.rating_count
            }))
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Database error"
        });
    }
}