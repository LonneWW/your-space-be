import Patient from "../models/Patient.js";
import Note from "../models/Note.js";
import Notification from "../models/Notification.js";

const patient = new Patient();
const noteModel = new Note();
const notificationModel = new Notification();

class PatientController {
  async getTherapists(req, res) {
    try {
      const therapists = await patient.getTherapistsList();
      return res.status(200).json({ therapists });
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }

  async changeTerapist(req, res) {
    try {
      const body = req.body;
      await patient.changeTerapist(body);
      return res.status(200).json({
        message:
          "You have successfully contacted the therapist. You'll receive a response soon.",
      });
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }

  async changeTerapistToNull(req, res) {
    try {
      const body = req.body;
      await patient.changeTerapistToNull(body);
      return res
        .status(200)
        .json({ message: "You have successfully removed your therapist." });
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }

  async getNotes(req, res) {
    try {
      const { patient_id } = req.query;
      const result = await noteModel.getNotes(patient_id);
      return res.status(200).json({ result });
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }

  async postNote(req, res) {
    try {
      const body = req.body;
      await noteModel.postNote("patient", body);
      return res.status(200).json({ message: "Note posted successfully." });
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }

  async updateNote(req, res) {
    try {
      const body = req.body;
      await noteModel.updateNote("patient", body);
      return res.status(200).json({ message: "Note updated successfully." });
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }

  async deleteNote(req, res) {
    try {
      const body = req.body;
      await noteModel.deleteNote("patient", body);
      return res.status(200).json({ message: "Note deleted successfully." });
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }

  async changeNoteVisibility(req, res) {
    try {
      const body = req.body;
      await noteModel.updateNoteVisibility(body);
      return res
        .status(200)
        .json({ message: "Visibility updated successfully." });
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }

  async getNotifications(req, res) {
    try {
      const { patient_id, therapist_id } = req.query;
      const id = patient_id ? patient_id : therapist_id;
      const result = await notificationModel.getNotifications("therapist", id);
      return res.status(200).json({ result });
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }

  async sendNotification(req, res) {
    try {
      const body = req.body;
      await notificationModel.postNotification("patient", body);
      return res
        .status(200)
        .json({ message: "Notification sent successfully." });
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }

  async deleteNotification(req, res) {
    try {
      const body = req.body;
      await notificationModel.deleteNotification("patient", body);
      return res
        .status(200)
        .json({ message: "Notification deleted successfully." });
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }
}

export default PatientController;
