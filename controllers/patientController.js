import Patient from "../models/Patient.js";
import Note from "../models/Note.js";
import Notification from "../models/Notification.js";

const patient = new Patient();
const noteModel = new Note();
const notificationModel = new Notification();

class PatientController {
  async getTherapists(req, res, next) {
    try {
      const therapists = await patient.getTherapistsList();
      return res.status(200).json(therapists);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getPatient(req, res, next) {
    try {
      const { id } = req.params;
      console.log(id);
      console.log(req.params);
      const result = await patient.getPatient(id);
      return res.status(200).json(result);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async selectTerapist(req, res, next) {
    try {
      const body = req.body;
      const { patient_id, therapist_id } = body;
      await patient.selectTerapist(patient_id, therapist_id);
      return res.status(200).json({
        message:
          "You have successfully contacted the therapist. You'll receive a response soon.",
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async changeTerapistToNull(req, res, next) {
    try {
      const body = req.body;
      const { patient_id, therapist_id } = body;
      await patient.changeTerapistToNull(patient_id, therapist_id);
      return res
        .status(200)
        .json({ message: "You have successfully removed your therapist." });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getNotes(req, res, next) {
    try {
      const { patient_id } = req.query;
      const result = await noteModel.getNotes(patient_id);
      return res.status(200).json(result);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async postNote(req, res, next) {
    try {
      const body = req.body;
      const { content, tags, patient_id } = body;
      await noteModel.postNote("patient", content, tags, patient_id);
      return res.status(200).json({ message: "Note posted successfully." });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async updateNote(req, res, next) {
    try {
      const body = req.body;
      const { note_id, content, tags, patient_id } = body;
      await noteModel.updateNote("patient", note_id, content, tags, patient_id);
      return res.status(200).json({ message: "Note updated successfully." });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async deleteNote(req, res, next) {
    try {
      const { note_id, patient_id } = req.query;
      await noteModel.deleteNote("patient", note_id, patient_id);
      return res.status(200).json({ message: "Note deleted successfully." });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async changeNoteVisibility(req, res, next) {
    try {
      const body = req.body;
      const { patient_id, note_id, shared } = body;
      await noteModel.updateNoteVisibility(patient_id, note_id, shared);
      return res
        .status(200)
        .json({ message: "Visibility updated successfully." });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getNotifications(req, res, next) {
    try {
      const { patient_id } = req.query;
      const result = await notificationModel.getNotifications(
        "patient",
        patient_id
      );
      return res.status(200).json(result);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async sendNotification(req, res, next) {
    try {
      const body = req.body;
      const { patient_id, content } = body;
      await notificationModel.postNotification("patient", patient_id, content);
      return res
        .status(200)
        .json({ message: "Notification sent successfully." });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async deleteNotification(req, res, next) {
    try {
      const { notification_id } = req.query;
      await notificationModel.deleteNotification("patient", notification_id);
      return res
        .status(200)
        .json({ message: "Notification deleted successfully." });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
}

export default PatientController;
