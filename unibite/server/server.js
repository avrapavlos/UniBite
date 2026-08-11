
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Create express application
const app = express();




// Start of the server
function initServer() {

    // Middle ware that will turn data into json
    app.use(express.json());

    // CORS support for requests from other origins
    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        next();
    });

    // Set paths
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Serve frontend files
    app.use(express.static(path.join(__dirname, "../public")));

    //INit routes
    setUpRoutes();

    // Start server
    app.listen(3000, () => {
        console.log("Server running on port 3000");
        console.log(__dirname);
        console.log(path.join(__dirname, "../public"));
    })
}


function setUpRoutes() {

    //Mount routes to server
    app.use("/api", authRoutes);
    app.use("/api", offerRoutes);
    app.use("/api/admin", adminRoutes);
}

initServer();
