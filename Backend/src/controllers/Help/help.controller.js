const Faq = require("../../models/Faq");
const HelpTicket = require("../../models/HelpTicket");

// GET FAQS
exports.getFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find().lean();
    const formattedFaqs = faqs.map(f => ({ ...f, id: f._id.toString() }));

    return res.status(200).json({
      success: true,
      data: formattedFaqs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------------- CREATE TICKET ----------------
exports.createTicket = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const userId = req.user?.id || req.body.userId;

    if (!userId || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "userId, subject, and message are required",
      });
    }

    const ticket = await HelpTicket.create({
      userId,
      subject,
      message,
    });

    const ticketObj = ticket.toObject();
    ticketObj.id = ticketObj._id.toString();

    return res.status(201).json({
      success: true,
      data: ticketObj,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------------- GET USER TICKETS ----------------
exports.getTickets = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const tickets = await HelpTicket.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    const formattedTickets = tickets.map(t => ({ ...t, id: t._id.toString() }));

    return res.status(200).json({
      success: true,
      data: formattedTickets,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------------- ADMIN: GET ALL TICKETS ----------------
exports.adminGetAllTickets = async (req, res) => {
  try {
    console.log("[Support Fix] Fetching all tickets for admin...");
    const tickets = await HelpTicket.find()
      .populate('userId', 'name email profilePic')
      .sort({ createdAt: -1 })
      .lean();

    console.log(`[Support Fix] Found ${tickets.length} tickets.`);

    const formattedTickets = tickets.map(ticket => {
      const user = ticket.userId;
      return {
        ...ticket,
        id: ticket._id.toString(),
        userId: user ? user._id.toString() : null,
        user: user ? { name: user.name, email: user.email, profilePic: user.profilePic } : null
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedTickets,
    });
  } catch (error) {
    console.error("[Support Fix] Error in adminGetAllTickets:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------------- ADMIN: UPDATE TICKET (Reply/Resolve) ----------------
exports.adminUpdateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply, status } = req.body;

    const ticket = await HelpTicket.findByIdAndUpdate(
      id,
      {
        reply,
        status: status || "RESOLVED"
      },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const ticketObj = ticket.toObject();
    ticketObj.id = ticketObj._id.toString();

    return res.status(200).json({
      success: true,
      data: ticketObj,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------------- ADMIN: CREATE FAQ ----------------
exports.createFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: "Question and answer are required",
      });
    }

    const faq = await Faq.create({
      question,
      answer,
    });

    const faqObj = faq.toObject();
    faqObj.id = faqObj._id.toString();

    return res.status(201).json({
      success: true,
      data: faqObj,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------------- ADMIN: DELETE FAQ ----------------
exports.deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await Faq.findByIdAndDelete(id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
