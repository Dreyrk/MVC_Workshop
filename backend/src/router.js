const express = require("express");
const multer = require("multer");

const router = express.Router();
const upload = multer({ dest: process.env.AVATAR_DIRECTORY });

// services d'auth
const {
  hashPassword,
  verifyPassword,
  verifyToken,
} = require("./services/auth");

const authControllers = require("./controllers/authControllers");
const Firestation = require("./controllers/FirestationControllers");
const vehicleControllers = require("./controllers/vehicleControllers");
const userControllers = require("./controllers/userControllers");
const fileControllers = require("./controllers/fileControllers");

// Auth
router.post("/api/register", hashPassword, userControllers.add);
router.post(
  "/api/login",
  authControllers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

// Gestion des casernes
router.get("/api/firestation", Firestation.browse);
router.get("/api/firestation/:id", Firestation.read);
router.post("/api/firestation", Firestation.add);
router.put("/api/firestation/:id", Firestation.edit);
router.delete("/api/firestation/:id", Firestation.destroy);

// Gestion des vehicles
router.get("/api/vehicle", vehicleControllers.browse);
router.get("/api/vehicle/:id", vehicleControllers.read);
router.post("/api/vehicle", vehicleControllers.add);
router.put("/api/vehicle/:id", vehicleControllers.edit);
router.put("/api/vehicle/", vehicleControllers.changeavailable);
router.delete("/api/vehicle/:id", vehicleControllers.destroy);

// Gestion des users
router.get("/api/users", userControllers.browse);
router.get("/api/users/:id", userControllers.read);
router.post("/api/users", hashPassword, userControllers.add);
router.put("/api/users/:id", hashPassword, verifyToken, userControllers.edit);
router.delete("/api/users/:id", verifyToken, userControllers.destroy);

// Gestion des avatars
router.post(
  "/api/avatars",
  verifyToken,
  upload.single("avatar"),
  fileControllers.renameAvatar,
  userControllers.updateAvatar
);
router.get("/api/avatars/:fileName", fileControllers.sendAvatar);

module.exports = router;
