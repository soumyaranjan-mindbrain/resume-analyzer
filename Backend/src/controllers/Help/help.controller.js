const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET FAQS
exports.getFaqs = async (req, res) => {
  try {
    const faqs = await prisma.faq.findMany();

    return res.status(200).json({
      success: true,
      data: faqs,
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
    const { userId, subject, message } = req.body;

    if (!userId || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "userId, subject, and message are required",
      });
    }

    const ticket = await prisma.helpTicket.create({
      data: {
        userId,
        subject,
        message,
      },
    });

    return res.status(201).json({
      success: true,
      data: ticket,
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
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const tickets = await prisma.helpTicket.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
