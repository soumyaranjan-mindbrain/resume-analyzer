const express = require("express");
const router = express.Router();

const helpController = require("../../controllers/Help/help.controller");

// GET FAQs
router.get("/faqs", helpController.getFaqs);

// CREATE TICKET
router.post("/ticket", helpController.createTicket);

// GET USER TICKETS
router.get("/ticket/:userId", helpController.getTickets);

module.exports = router;
