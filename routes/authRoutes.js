import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import AuthController from "../controllers/authController.js";

const router = express.Router();
const authController = new AuthController();

router.get("/verify-session", verifyToken, (req, res, next) => {
  const token = req.cookies.accessToken;
  res.status(200).json({ message: "User authorized successfully." });
});

router.post("/register/therapist", (req, res, next) => {
  authController.registerTherapist(req, res, next);
});

router.post("/register/patient", (req, res, next) => {
  authController.registerPatient(req, res, next);
});

router.post("/login/therapist", (req, res, next) => {
  const token = req.cookies.accessToken;
  authController.loginTherapist(req, res, next);
});

router.post("/login/patient", (req, res, next) => {
  authController.loginPatient(req, res, next);
});

export default router;
