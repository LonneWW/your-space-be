import express from "express";
import PatientController from "../controllers/patientController.js";

const router = express.Router();
const patientController = new PatientController();

router.get("/therapists", (req, res, next) => {
  patientController.getTherapists(req, res, next);
});

router.get("/therapist/:id", (req, res, next) => {
  patientController.getTherapist(req, res, next);
});

router.get("/notes", (req, res, next) => {
  patientController.getNotes(req, res, next);
});

router.get("/notifications", (req, res, next) => {
  patientController.getNotifications(req, res, next);
});

router.post("/notes", (req, res, next) => {
  patientController.postNote(req, res, next);
});

router.post("/notifications", (req, res, next) => {
  patientController.sendNotification(req, res, next);
});

router.put("/select-therapist", (req, res, next) => {
  patientController.selectTerapist(req, res, next);
});

router.put("/unlink-therapist", (req, res, next) => {
  patientController.changeTerapistToNull(req, res, next);
});

router.put("/notes", (req, res, next) => {
  patientController.updateNote(req, res, next);
});

router.put("/notes/visibility", (req, res, next) => {
  patientController.changeNoteVisibility(req, res, next);
});

router.delete("/notes", (req, res, next) => {
  patientController.deleteNote(req, res, next);
});

router.delete("/notifications", (req, res, next) => {
  patientController.deleteNotification(req, res, next);
});

router.get("/:id", (req, res, next) => {
  patientController.getPatient(req, res, next);
});

export default router;
