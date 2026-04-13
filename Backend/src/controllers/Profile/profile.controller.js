const prisma = require("../../prisma/client");  
const bcrypt = require("bcryptjs");

// ====================
// Create Profile API
// ====================
exports.createProfile = async (req, res) => {
  try {
    const { name, email, password, role, bio } = req.body; 

    if (!email || !password || !role) {
      return res.status(400).json({ error: "Email, password, and role are required" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        bio
      }
    });

    res.status(201).json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ====================
// Update Profile API
// ====================
exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, bio } = req.body; 

    if (!name && !bio) {
      return res.status(400).json({ error: "At least one field (name or bio) is required to update" });
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(bio && { bio })
      }
    });

    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};