const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../../middleware/authmiddleware");

const {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  changePassword,
} = require("../../controllers/Auth/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.get("/me", authMiddleware, getMe);
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;