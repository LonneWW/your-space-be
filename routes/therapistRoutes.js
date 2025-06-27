import express from "express";
import TherapistController from "../controllers/therapistController.js";

const router = express.Router();
const therapistController = new TherapistController();

router.get("/patients", (req, res, next) => {
  therapistController.getTherapistPatients(req, res, next);
});

router.get("/notes", (req, res, next) => {
  therapistController.getNotes(req, res, next);
});

router.get("/patient-notes", (req, res, next) => {
  therapistController.getPatientNotes(req, res, next);
});

router.get("/notes-about-patient", (req, res, next) => {
  therapistController.getNotesAboutPatient(req, res, next);
});

router.get("/notifications", (req, res, next) => {
  therapistController.getNotifications(req, res, next);
});

router.get("/:id", (req, res, next) => {
  therapistController.getTherapist(req, res, next);
});

router.post("/notes", (req, res, next) => {
  therapistController.postNote(req, res, next);
});

router.post("/notifications", (req, res, next) => {
  therapistController.sendNotification(req, res, next);
});

router.put("/notes", (req, res, next) => {
  therapistController.updateNote(req, res, next);
});

router.put("/accept-patient", (req, res, next) => {
  therapistController.acceptPatient(req, res, next);
});

router.put("/discharge-patient", (req, res, next) => {
  therapistController.dischargePatient(req, res, next);
});

router.delete("/notes", (req, res, next) => {
  therapistController.deleteNote(req, res, next);
});

router.delete("/notifications", (req, res, next) => {
  therapistController.deleteNotification(req, res, next);
});

export default router;
