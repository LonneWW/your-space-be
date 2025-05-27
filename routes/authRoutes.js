import express from "express";
import AuthController from "../controllers/authController.js";

const router = express.Router();
const authController = new AuthController();

router.post("/register/therapist", (req, res, next) => {
  console.log("qui");
  authController.registerTherapist(req, res, next);
});

router.post("/register/patient", (req, res, next) => {
  console.log("qui");
  authController.registerPatient(req, res, next);
});

router.post("/login/therapist", (req, res, next) => {
  console.log("qui");
  authController.loginTherapist(req, res, next);
});

router.post("/login/patient", (req, res, next) => {
  console.log("qui");
  authController.loginPatient(req, res, next);
});

export default router;
