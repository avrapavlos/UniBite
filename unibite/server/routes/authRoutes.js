import express from "express";
import { login } from "../controllers/authController.js";

//Create router 
const router = express.Router();

// POST /api/login
router.post("/login", login);

export default router;