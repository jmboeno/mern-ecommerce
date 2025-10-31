import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import { getAllOrders, deleteOrder, getMyOrders } from "../controllers/order.controller.js";

const router = express.Router();

// Rotas Admin
router.get("/", protectRoute, adminRoute, getAllOrders);
router.delete("/:id", protectRoute, adminRoute, deleteOrder); 

// Rota Cliente
router.get("/my", protectRoute, getMyOrders); // Rota para buscar pedidos do utilizador logado

export default router;