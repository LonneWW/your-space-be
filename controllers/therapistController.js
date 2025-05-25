import Therapist from "../models/Therapist.js";
import Note from "../models/Note.js";
import Notification from "../models/Notification.js";

const therapist = new Therapist();
const noteModel = new Note();
const notificationModel = new Notification();

class TherapistController {
  async getTherapistPatients(req, res) {
    try {
      const { therapist_id } = req.query;
      const patients = await therapist.getTherapistPatients(therapist_id);
      return res.status(200).json({ patients });
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }

  async dischargePatient(req, res) {
    try {
      const body = req.body;
      await therapist.dischargePatient(body);
      return res
        .status(200)
        .json({ message: "Patient discharged successfully." });
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }

  async getPatientNotes(req, res) {
    try {
      const { patient_id, therapist_id } = req.query;
      const notes = await noteModel.getPatientNotes(patient_id, therapist_id);
      return res.status(200).json({ notes });
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }

  async getNotesAboutPatient(req, res) {
    try {
      const body = req.body;
      const { id } = req.params;
      console.log(body);
      console.log(id);
      body.patient_id = id;
      const notes = await noteModel.getNotesAboutPatient(body);
      return res.status(200).json({ notes });
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }

  async createNote(req, res) {
    try {
      console.log(req.body);
      const body = req.body;
      await noteModel.postNote("therapist", body);
      return res.status(200).json({ message: "Note posted successfully." });
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }

  async updateNote(req, res) {
    try {
      const body = req.body;
      await noteModel.updateNote("therapist", body);
      return res.status(200).json({ message: "Note updated successfully." });
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }

  async deleteNote(req, res) {
    try {
      const body = req.body;
      await noteModel.deleteNote("therapist", body);
      return res.status(200).json({ message: "Note deleted successfully." });
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
      await notificationModel.postNotification("therapist", body);
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
      await notificationModel.deleteNotification("therapist", body);
      return res
        .status(200)
        .json({ message: "Notification deleted successfully." });
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }

  async acceptPatient(req, res) {
    try {
      const body = req.body;
      const { id } = req.params;
      body.patient_id = id;
      await therapist.updatePatient(body);
      return res.status(200).json({ message: "Linked successfully." });
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }
}

export default TherapistController;
