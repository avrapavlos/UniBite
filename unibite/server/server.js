// Import express backend framework
const express = require("express");

// Create express application
const app = express();

// Start of the server
function initServer() {



    // MIddle ware that will turn data into json
    app.use(express.json());

    //INit routes
    setUpRoutes();

    // Start server
    app.listen(3000, () => {
        console.log("Server running on port 3000");
    })
}


function setUpRoutes() {
    // Import route to server
    const hello = require("./routes/hello");

    // Mount / to hello router
    app.use("/", hello);
}

initServer();
