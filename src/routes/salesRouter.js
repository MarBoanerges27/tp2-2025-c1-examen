import express from "express";
import { getAllSales, getSaleById, getSalesWithTotal, getSalesByCustomer, updateCouponUsed, getTopProducts, getSalesWithCouponAvailable } from "../controllers/salesController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllSales);
router.get("/total", authMiddleware, getSalesWithTotal);
router.get("/top-products", authMiddleware, getTopProducts);
router.get("/coupon-available", authMiddleware, getSalesWithCouponAvailable);
router.get("/:id", authMiddleware, getSaleById);
router.put("/:id/coupon-used", authMiddleware, updateCouponUsed);
router.get("/customer/:email", authMiddleware, getSalesByCustomer);



export default router;
