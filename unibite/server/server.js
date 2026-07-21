// Import express backend framework
const express = require("express");

//Create path
const path = require("path");

// Create express application
const app = express();


// Start of the server
function initServer() {



    // MIddle ware that will turn data into json
    app.use(express.json());

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
    // Set up auth routes
    const authRoutes = require("./routes/authRoutes");

    //Mount route to server
    app.use("/api", authRoutes);
}

initServer();
