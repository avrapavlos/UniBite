import express from "express";
import { login } from "../controllers/authController.js";
import { register } from "../controllers/authController.js";
//Create router 
const router = express.Router();

// POST /api/login
router.post("/login", login);


// POST /api/register
router.post("/register", register);

export default router;