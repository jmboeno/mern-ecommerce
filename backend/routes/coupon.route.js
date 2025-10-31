import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import { getCoupon, validateCoupon, createCoupon, getAllCoupons, deleteCoupon, updateCoupon } from "../controllers/coupon.controller.js"; // Importe o novo controlador

const router = express.Router();

router.get("/", protectRoute, getCoupon);
router.post("/validate", protectRoute, validateCoupon);

router.get("/all", protectRoute, adminRoute, getAllCoupons);
router.post("/create", protectRoute, adminRoute, createCoupon);
router.put("/:id", protectRoute, adminRoute, updateCoupon);
router.delete("/:id", protectRoute, adminRoute, deleteCoupon);

export default router;