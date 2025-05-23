import express from "express";
import PatientController from "../controllers/patientController.js";

const router = express.Router();
const patientController = new PatientController();

router.get("/get-therapists", (req, res) => {
  console.log("qui");
  patientController.getTherapists(req, res);
});

router.get("/notes", (req, res) => {
  console.log("get notes!");
  patientController.getNotes(req, res);
});

router.get("/notifications", (req, res) => {
  console.log("get notification!");
  patientController.getNotifications(req, res);
});

router.post("/notes", (req, res) => {
  console.log("post note!");
  patientController.postNote(req, res);
});

router.post("/notifications", (req, res) => {
  console.log("post notification!");
  patientController.sendNotification(req, res);
});

router.put("/notes", (req, res) => {
  console.log("update note!");
  patientController.updateNote(req, res);
});

router.put("/notes/visibility", (req, res) => {
  console.log("update note visibility!");
  patientController.changeNoteVisibility(req, res);
});

router.delete("/notes", (req, res) => {
  console.log("delete note!");
  patientController.deleteNote(req, res);
});

router.delete("/notifications", (req, res) => {
  console.log("delete notification!");
  patientController.deleteNotification(req, res);
});

export default router;
