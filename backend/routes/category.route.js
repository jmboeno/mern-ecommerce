// mern-ecommerce/backend/routes/category.route.js
import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import { createCategory, getAllCategories, updateCategory, deleteCategory } from "../controllers/category.controller.js";

const router = express.Router();

router.get("/", getAllCategories);
router.post("/", protectRoute, adminRoute, createCategory);
router.put("/:id", protectRoute, adminRoute, updateCategory);
router.delete("/:id", protectRoute, adminRoute, deleteCategory);

export default router;