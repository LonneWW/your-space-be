import express from "express";
import TherapistController from "../controllers/therapistController.js";

const router = express.Router();
const therapistController = new TherapistController();

router.get("/patients", (req, res) => {
  console.log("get therapist patients");
  therapistController.getTherapistPatients(req, res);
});

router.get("/patient-notes", (req, res) => {
  console.log("get patient notes");
  therapistController.getPatientNotes(req, res);
});

router.get("/notes-about-patient/:id", (req, res) => {
  console.log("get notes about patient");
  therapistController.getNotesAboutPatient(req, res);
});

router.get("/notifications", (req, res) => {
  console.log("get notification!");
  therapistController.getNotifications(req, res);
});

router.post("/notes", (req, res) => {
  console.log("note posted");
  therapistController.createNote(req, res);
});

router.post("/notifications", (req, res) => {
  console.log("post notification!");
  therapistController.sendNotification(req, res);
});

router.put("/notes", (req, res) => {
  console.log("note modify");
  therapistController.updateNote(req, res);
});

router.put("/patient/:id", (req, res) => {
  console.log("put patient");
  therapistController.acceptPatient(req, res);
});

router.delete("/notes", (req, res) => {
  console.log("note delete");
  therapistController.deleteNote(req, res);
});

router.delete("/notifications", (req, res) => {
  console.log("delete notification!");
  therapistController.deleteNotification(req, res);
});

export default router;
