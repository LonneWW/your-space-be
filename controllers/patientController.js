import express from "express";
import Patient from "../models/Patient.js";

const app = express();
const patient = new Patient();

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
      const result = await patient.changeTerapistToNull(body);
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
      const body = req.body;
      const result = await patient.getNotes(body);
      return res.status(200).json({ result });
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }

  async postNote(req, res) {
    try {
      const body = req.body;
      const result = await patient.createNote("patient", body);
      return res.status(200).json({ message: "Note posted successfully." });
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }

  async updateNote(req, res) {
    try {
      const body = req.body;
      const result = await patient.updateNote(body);
      return res.status(200).json({ message: "Note updated successfully." });
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }

  async deleteNote(req, res) {
    try {
      const body = req.body;
      const result = await patient.deleteNote(body);
      return res.status(200).json({ message: "Note deleted successfully." });
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }

  async changeNoteVisibility(req, res) {
    try {
      const body = req.body;
      const result = await patient.updateNoteVisibility(body);
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
      const body = req.body;
      const result = await patient.getNotifications("patient", body);
      return res.status(200).json({ result });
    } catch (e) {
      res.status(500).json({ error: "Serverside error." });
      throw e;
    }
  }

  async sendNotification(req, res) {
    try {
      const body = req.body;
      const result = await patient.postNotification("patient", body);
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
      const result = await patient.deleteNotification("patient", body);
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
