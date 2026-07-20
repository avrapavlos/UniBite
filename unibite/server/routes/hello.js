// Sets the neccesseties
const express = require("express");

// Creates a mini express application that answers to server js
const router = express.Router();

// Post route for /
router.get("/", (res) => {

    // Return response
    res.json({
        message:"Login received"
    });

});

// This exports the router for use for another file
module.exports = router;