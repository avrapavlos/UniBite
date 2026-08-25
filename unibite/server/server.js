
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import db from "./database/connection.js";

const app = express();

export async function ensureRequestsReferenceOfferTable() {
    const [tableRows] = await db.query("SHOW TABLES LIKE 'requests'");
    if (tableRows.length === 0) {
        return;
    }

    const [createRows] = await db.query("SHOW CREATE TABLE requests");
    const createSql = createRows[0]?.["Create Table"] || "";

    if (!createSql.includes("REFERENCES `advertisments` (`ad_id`)")) {
        return;
    }

    try {
        await db.query("ALTER TABLE requests DROP FOREIGN KEY fk_advertisment");
    } catch (err) {
        console.warn("Could not drop legacy requests fk_advertisment:", err.message);
    }

    try {
        await db.query("ALTER TABLE requests DROP INDEX fk_advertisment");
    } catch (err) {
        console.warn("Could not drop legacy requests index:", err.message);
    }

    await db.query("ALTER TABLE requests ADD CONSTRAINT fk_requests_offer FOREIGN KEY (ad_id) REFERENCES offers(id)");
}

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

async function initServer() {
    await ensureRequestsReferenceOfferTable();
    await ensureClaimAndRatingSchema();

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

    setUpRoutes();

    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}

function setUpRoutes() {
    app.use("/api", authRoutes);
    app.use("/api", offerRoutes);
    app.use("/api/admin", adminRoutes);
}

initServer();
