import Therapist from "../models/Therapist.js";
import Note from "../models/Note.js";
import Notification from "../models/Notification.js";
import { ApiError } from "../utils/ApiError.js";

const therapist = new Therapist();
const noteModel = new Note();
const notificationModel = new Notification();

class TherapistController {
  async getTherapist(req, res, next) {
    try {
      const { id } = req.params;
      const result = await therapist.getTherapist(id);
      return res.status(200).json(result);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getTherapistPatients(req, res, next) {
    try {
      const { therapist_id } = req.query;
      console.log(therapist_id);
      const patients = await therapist.getTherapistPatients(therapist_id);
      return res.status(200).json({ patients });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getNotes(req, res, next) {
    try {
      const { therapist_id, note_id, title, tag, dateFrom, dateTo } = req.query;
      const filters = { note_id, title, tag, dateFrom, dateTo };
      const result = await noteModel.getNotes(
        "therapist",
        therapist_id,
        filters
      );
      return res.status(200).json(result);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getPatientNotes(req, res, next) {
    try {
      const { patient_id, therapist_id } = req.query;
      const notes = await noteModel.getPatientNotes(patient_id, therapist_id);
      return res.status(200).json(notes);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getNotesAboutPatient(req, res, next) {
    try {
      const body = req.body;
      const { patient_id, therapist_id } = req.query;
      const notes = await noteModel.getNotesAboutPatient(
        patient_id,
        therapist_id
      );
      return res.status(200).json(notes);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async postNote(req, res, next) {
    try {
      console.log(req.body);
      const body = req.body;
      const { content, title, tags, patient_id, therapist_id } = body;
      await noteModel.postNote(
        "therapist",
        title,
        content,
        tags,
        patient_id,
        therapist_id
      );
      return res.status(200).json({ message: "Note posted successfully." });
    } catch (e) {
      next(e);
    }
  }

  async updateNote(req, res, next) {
    try {
      const body = req.body;
      console.log(body);
      const { content, tags, therapist_id, note_id } = body;
      await noteModel.updateNote(
        "therapist",
        note_id,
        "Patient note",
        content,
        tags,
        therapist_id
      );
      return res.status(200).json({ message: "Note updated successfully." });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async deleteNote(req, res, next) {
    try {
      const { note_id, therapist_id } = req.query;
      await noteModel.deleteNote("therapist", note_id, therapist_id);
      return res.status(200).json({ message: "Note deleted successfully." });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getNotifications(req, res, next) {
    try {
      const { therapist_id } = req.query;
      console.log(therapist_id);
      console.log("AAAAAAAAAH");
      const result = await notificationModel.getNotifications(
        "therapist",
        therapist_id
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
      console.log(e);
      next(e);
    }
  }

  async deleteNotification(req, res, next) {
    try {
      const { notification_id } = req.query;
      await notificationModel.deleteNotification("therapist", notification_id);
      return res
        .status(200)
        .json({ message: "Notification deleted successfully." });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async acceptPatient(req, res, next) {
    try {
      const { therapist_id, patient_id } = req.body;
      console.log(req.body);
      const user = await therapist.acceptPatient(therapist_id, patient_id);
      await noteModel.postNote(
        "therapist",
        `New Patient Note`,
        '{"ops":[{"insert":"New note"}]}',
        null,
        patient_id,
        therapist_id
      );
      await notificationModel.postNotification(
        "patient",
        patient_id,
        `The therapist ${user.name} ${user.surname} has accepted to link with you.`
      );
      return res.status(200).json({ message: "Linked successfully." });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async dischargePatient(req, res, next) {
    try {
      const { therapist_id, patient_id } = req.body;
      const message = await therapist.dischargePatient(
        therapist_id,
        patient_id
      );
      try {
        const note = await noteModel.getNotesAboutPatient(
          patient_id,
          therapist_id
        );
        console.log(note);
        await noteModel.deleteNote("therapist", note[0].id, therapist_id);
        await notificationModel.postNotification(
          "patient",
          patient_id,
          message
        );
      } catch (e) {
        console.log(e);
        throw new ApiError(
          500,
          `Patient discharged correctly. Couldn't send notifiction, server-side error.`
        );
      }
      return res
        .status(200)
        .json({ message: "Patient discharged successfully." });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
}

export default TherapistController;
