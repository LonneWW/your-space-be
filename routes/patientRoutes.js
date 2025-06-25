import express from "express";
import PatientController from "../controllers/patientController.js";

const router = express.Router();
const patientController = new PatientController();

router.get("/therapists", (req, res, next) => {
  console.log("quello giusto Z");
  patientController.getTherapists(req, res, next);
});

router.get("/notes", (req, res, next) => {
  console.log("get notes!");
  patientController.getNotes(req, res, next);
});

router.get("/notifications", (req, res, next) => {
  console.log("get notification!");
  patientController.getNotifications(req, res, next);
});

router.post("/notes", (req, res, next) => {
  console.log("post note!");
  patientController.postNote(req, res, next);
});

router.post("/notifications", (req, res, next) => {
  console.log("post notification!");
  patientController.sendNotification(req, res, next);
});

router.put("/therapist", (req, res, next) => {
  console.log("put therapist!");
  patientController.selectTerapist(req, res, next);
});

router.put("/unlink-therapist", (req, res, next) => {
  console.log("put therapist-null!");
  patientController.changeTerapistToNull(req, res, next);
});

router.put("/notes", (req, res, next) => {
  console.log("update note!");
  patientController.updateNote(req, res, next);
});

router.put("/notes/visibility", (req, res, next) => {
  console.log("update note visibility!");
  patientController.changeNoteVisibility(req, res, next);
});

router.delete("/notes", (req, res, next) => {
  console.log("delete note!");
  patientController.deleteNote(req, res, next);
});

router.delete("/notifications", (req, res, next) => {
  console.log("delete notification!");
  patientController.deleteNotification(req, res, next);
});

router.get("/:id", (req, res, next) => {
  console.log("qui");
  patientController.getPatient(req, res, next);
});
export default router;
