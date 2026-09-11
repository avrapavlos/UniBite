import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import db from "./database/connection.js";

const app = express();

export async function ensureRequestsReferenceOfferTable() {
    const [tableRows] = await db.query("SHOW TABLES LIKE 'requests'");
    if (tableRows.length === 0) {
        return;
    }

    const [offerTableRows] = await db.query("SHOW TABLES LIKE 'offers'");
    if (offerTableRows.length === 0) {
        return;
    }

    const [foreignKeys] = await db.query(`
        SELECT CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
        FROM information_schema.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'requests'
          AND COLUMN_NAME = 'id'
          AND REFERENCED_TABLE_NAME IS NOT NULL
    `);

    const hasOfferReference = foreignKeys.some((foreignKey) =>
        foreignKey.REFERENCED_TABLE_NAME === "offers"
        && foreignKey.REFERENCED_COLUMN_NAME === "id"
    );

    for (const foreignKey of foreignKeys) {
        const referencesOffers = foreignKey.REFERENCED_TABLE_NAME === "offers"
            && foreignKey.REFERENCED_COLUMN_NAME === "id";

        if (!referencesOffers) {
            await db.query(`ALTER TABLE requests DROP FOREIGN KEY \`${foreignKey.CONSTRAINT_NAME}\``);
        }
    }

    if (!hasOfferReference) {
        await db.query("ALTER TABLE requests ADD CONSTRAINT fk_requests_offer FOREIGN KEY (id) REFERENCES offers(id)");
    }
}
//git broke i am trying to fix it
async function ensureClaimAndRatingSchema() {
    const requiredColumns = {
        requests: [
            { name: "status", definition: "ENUM('PENDING','ACCEPTED','REJECTED') NOT NULL DEFAULT 'PENDING'" },
            { name: "claimed_portions", definition: "INT NOT NULL DEFAULT 1" },
            { name: "created_at", definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
            { name: "accepted_at", definition: "TIMESTAMP NULL" },
            { name: "rejected_at", definition: "TIMESTAMP NULL" },
            { name: "updated_at", definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" }
        ],
        ratings: [
            { name: "score", definition: "INT NOT NULL DEFAULT 0" },
            { name: "comment", definition: "TEXT" },
            { name: "rater_id", definition: "INT NULL" },
            { name: "rated_user_id", definition: "INT NULL" },
            { name: "created_at", definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" }
        ]
    };

    for (const [tableName, columns] of Object.entries(requiredColumns)) {
        const [rows] = await db.query(`SHOW COLUMNS FROM ${tableName}`);
        const existing = new Set(rows.map((column) => column.Field));

        for (const column of columns) {
            if (!existing.has(column.name)) {
                await db.query(`ALTER TABLE ${tableName} ADD COLUMN ${column.name} ${column.definition}`);
            }
        }
    }
}

async function ensureClaimPortionTriggerRemoved() {
    try {
        await db.query("DROP TRIGGER IF EXISTS inactivation");
    } catch (err) {
        console.warn("Could not remove legacy claim portion trigger:", err.message);
    }
}

async function initServer() {
    console.log("Initializing server...");
    await ensureRequestsReferenceOfferTable();
    await ensureClaimAndRatingSchema();
    await ensureClaimPortionTriggerRemoved();

    app.use(express.json());

    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        next();
    });

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    app.use(express.static(path.join(__dirname, "../public")));
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));

    setUpRoutes();

    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}

function setUpRoutes() {
    app.use("/api", authRoutes);
    app.use("/api", offerRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/users", userRoutes);
}

initServer();