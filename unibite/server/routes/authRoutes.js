const express = require("express");

const router = express.Router();

// POST /api/login
router.post("/login", (req, res) => {

    console.log(req.body);

    const { email, password } = req.body;

    res.json({
        success: true,
        message: "Login received",
        email: email
    });
});

module.exports = router;