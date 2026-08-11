import express from "express";
import { loginAdmin, getDashboardStats } from "../controllers/adminController.js";

const router = express.Router();
router.post("/login", loginAdmin);
router.get("/dashboard", getDashboardStats);
export default router;