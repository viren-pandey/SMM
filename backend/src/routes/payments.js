const express = require("express");
const {
    addFundsManual,
    updatePaymentStatus,
    getPayments
} = require("../controllers/payments");
const { getTransactions } = require("../controllers/transactions");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.use(protect);

router.post("/add-funds", addFundsManual);
router.get("/transactions", getTransactions);

// Admin only
router.get("/", authorize("admin"), getPayments);
router.put("/:id/status", authorize("admin"), updatePaymentStatus);

module.exports = router;
