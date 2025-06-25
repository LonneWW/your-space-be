import express from "express";
import TherapistController from "../controllers/therapistController.js";

const router = express.Router();
const therapistController = new TherapistController();

router.get("/patients", (req, res, next) => {
  console.log("get therapist patients");
  therapistController.getTherapistPatients(req, res, next);
});

router.get("/notes", (req, res, next) => {
  console.log("get notes!");
  therapistController.getNotes(req, res, next);
});

router.get("/patient-notes", (req, res, next) => {
  console.log("get patient notes");
  therapistController.getPatientNotes(req, res, next);
});

router.get("/notes-about-patient", (req, res, next) => {
  console.log("get notes about patient");
  therapistController.getNotesAboutPatient(req, res, next);
});

router.get("/notifications", (req, res, next) => {
  console.log("get notification!");
  therapistController.getNotifications(req, res, next);
});

router.get("/:id", (req, res, next) => {
  console.log("qui");
  therapistController.getTherapist(req, res, next);
});

router.post("/notes", (req, res, next) => {
  console.log("note posted");
  therapistController.postNote(req, res, next);
});

router.post("/notifications", (req, res, next) => {
  console.log("post notification!");
  therapistController.sendNotification(req, res, next);
});

router.put("/notes", (req, res, next) => {
  console.log("note modify");
  therapistController.updateNote(req, res, next);
});

router.put("/accept-patient", (req, res, next) => {
  console.log("put patient");
  therapistController.acceptPatient(req, res, next);
});

router.put("/discharge-patient", (req, res, next) => {
  console.log("put patient");
  therapistController.dischargePatient(req, res, next);
});

router.delete("/notes", (req, res, next) => {
  console.log("note delete");
  therapistController.deleteNote(req, res, next);
});

router.delete("/notifications", (req, res, next) => {
  console.log("delete notification!");
  therapistController.deleteNotification(req, res, next);
});

export default router;
