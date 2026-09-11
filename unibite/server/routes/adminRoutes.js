import express from "express";
import { loginAdmin, getDashboardStats } from "../controllers/adminController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();
router.post("/login", loginAdmin);
router.get("/dashboard", requireAdmin, getDashboardStats);
export default router;