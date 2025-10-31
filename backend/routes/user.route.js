// mern-ecommerce/backend/routes/user.route.js
import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import { getAllUsers, deleteUser, createUserByAdmin, updateUser, updateUserProfile, toggleUserVerification } from "../controllers/user.controller.js";

const router = express.Router();

// Rotas Admin
router.get("/", protectRoute, adminRoute, getAllUsers);
router.post("/", protectRoute, adminRoute, createUserByAdmin); 
router.put("/:id", protectRoute, adminRoute, updateUser); 
router.delete("/:id", protectRoute, adminRoute, deleteUser);

// NOVO: Rota para toggle do status de verificação
router.patch("/:id/verify", protectRoute, adminRoute, toggleUserVerification);

// Rota Cliente/Próprio Perfil
router.put("/profile", protectRoute, updateUserProfile);

export default router;