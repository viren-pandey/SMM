const express = require("express");
const {
    getPaymentProviders,
    getPaymentProvider,
    createPaymentProvider,
    updatePaymentProvider,
    deletePaymentProvider
} = require("../controllers/paymentProviders");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

// Public route to get active providers
router.get("/", getPaymentProviders);

// Admin only routes
router.use(protect);
router.use(authorize("admin"));

router.post("/", createPaymentProvider);

router
    .route("/:id")
    .get(getPaymentProvider)
    .put(updatePaymentProvider)
    .delete(deletePaymentProvider);

module.exports = router;
