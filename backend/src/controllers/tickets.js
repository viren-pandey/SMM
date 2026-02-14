const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const Ticket = require('../models/Ticket');

// @desc    Get all tickets (admin sees all, users see their own)
// @route   GET /api/v1/tickets
// @access  Private
exports.getTickets = asyncHandler(async (req, res, next) => {
    const query = req.user.role === 'admin' ? {} : { user: req.user.id };

    const tickets = await Ticket.find(query)
        .populate('user', 'username email')
        .populate('replies.user', 'username')
        .sort('-createdAt');

    res.status(200).json({
        success: true,
        count: tickets.length,
        data: tickets
    });
});

// @desc    Get single ticket
// @route   GET /api/v1/tickets/:id
// @access  Private
exports.getTicket = asyncHandler(async (req, res, next) => {
    const ticket = await Ticket.findById(req.params.id)
        .populate('user', 'username email')
        .populate('replies.user', 'username');

    if (!ticket) {
        return next(new ErrorResponse('Ticket not found', 404));
    }

    // Users can only see their own tickets
    if (req.user.role !== 'admin' && ticket.user._id.toString() !== req.user.id) {
        return next(new ErrorResponse('Not authorized to access this ticket', 403));
    }

    res.status(200).json({
        success: true,
        data: ticket
    });
});

// @desc    Create ticket
// @route   POST /api/v1/tickets
// @access  Private
exports.createTicket = asyncHandler(async (req, res, next) => {
    req.body.user = req.user.id;

    const ticket = await Ticket.create(req.body);

    res.status(201).json({
        success: true,
        data: ticket
    });
});

// @desc    Add reply to ticket
// @route   POST /api/v1/tickets/:id/reply
// @access  Private
exports.addReply = asyncHandler(async (req, res, next) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        return next(new ErrorResponse('Ticket not found', 404));
    }

    // Users can only reply to their own tickets
    if (req.user.role !== 'admin' && ticket.user.toString() !== req.user.id) {
        return next(new ErrorResponse('Not authorized to reply to this ticket', 403));
    }

    ticket.replies.push({
        user: req.user.id,
        message: req.body.message,
        isAdmin: req.user.role === 'admin'
    });

    // Reopen ticket if user replies
    if (ticket.status === 'closed' && req.user.role !== 'admin') {
        ticket.status = 'open';
    }

    await ticket.save();

    res.status(200).json({
        success: true,
        data: ticket
    });
});

// @desc    Update ticket status
// @route   PUT /api/v1/tickets/:id/status
// @access  Private/Admin
exports.updateTicketStatus = asyncHandler(async (req, res, next) => {
    const { status } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        return next(new ErrorResponse('Ticket not found', 404));
    }

    ticket.status = status;

    if (status === 'closed') {
        ticket.closedAt = Date.now();
        ticket.closedBy = req.user.id;
    }

    await ticket.save();

    res.status(200).json({
        success: true,
        data: ticket
    });
});

// @desc    Delete ticket
// @route   DELETE /api/v1/tickets/:id
// @access  Private/Admin
exports.deleteTicket = asyncHandler(async (req, res, next) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        return next(new ErrorResponse('Ticket not found', 404));
    }

    await ticket.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});
