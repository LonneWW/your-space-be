import Therapist from "../models/Therapist.js";
import Note from "../models/Note.js";
import Notification from "../models/Notification.js";

const therapist = new Therapist();
const noteModel = new Note();
const notificationModel = new Notification();

class TherapistController {
  async getTherapist(req, res) {
    try {
      const { id } = req.params;
      const result = await therapist.getTherapist(id);
      return res.status(200).json(result);
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }

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
      const { therapist_id, patient_id } = req.body;
      await therapist.dischargePatient(therapist_id, patient_id);
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
      return res.status(200).json(notes);
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }

  async getNotesAboutPatient(req, res) {
    try {
      const body = req.body;
      const { patient_id, therapist_id } = req.query;
      const notes = await noteModel.getNotesAboutPatient(
        patient_id,
        therapist_id
      );
      return res.status(200).json(notes);
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }

  async createNote(req, res) {
    try {
      console.log(req.body);
      const body = req.body;
      const { content, tags, patient_id, therapist_id } = body;
      await noteModel.postNote(
        "therapist",
        content,
        tags,
        patient_id,
        therapist_id
      );
      return res.status(200).json({ message: "Note posted successfully." });
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }

  async updateNote(req, res) {
    try {
      const body = req.body;
      const { content, tags, therapist_id, note_id } = body;
      await noteModel.updateNote(
        "therapist",
        note_id,
        content,
        tags,
        therapist_id
      );
      return res.status(200).json({ message: "Note updated successfully." });
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }

  async deleteNote(req, res) {
    try {
      const { note_id, therapist_id } = req.query;
      await noteModel.deleteNote("therapist", note_id, therapist_id);
      return res.status(200).json({ message: "Note deleted successfully." });
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }

  async getNotifications(req, res) {
    try {
      const { therapist_id } = req.query;
      const result = await notificationModel.getNotifications(
        "therapist",
        therapist_id
      );
      return res.status(200).json(result);
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }

  async sendNotification(req, res) {
    try {
      const body = req.body;
      const { patient_id, therapist_id, content } = body;
      await notificationModel.postNotification(
        "therapist",
        patient_id,
        content,
        therapist_id
      );
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
      const { notification_id } = req.query;
      await notificationModel.deleteNotification("therapist", notification_id);
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
      const { therapist_id, patient_id } = req.body;
      await therapist.acceptPatient(therapist_id, patient_id);
      return res.status(200).json({ message: "Linked successfully." });
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }
}

export default TherapistController;
