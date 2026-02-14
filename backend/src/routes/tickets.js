const express = require("express");
const {
    getTickets,
    getTicket,
    createTicket,
    addReply,
    updateTicketStatus,
    deleteTicket
} = require("../controllers/tickets");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.use(protect);

router
    .route("/")
    .get(getTickets)
    .post(createTicket);

router
    .route("/:id")
    .get(getTicket)
    .delete(authorize("admin"), deleteTicket);

router.post("/:id/reply", addReply);
router.put("/:id/status", authorize("admin"), updateTicketStatus);

module.exports = router;
