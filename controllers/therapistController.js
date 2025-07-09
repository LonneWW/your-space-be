import Therapist from "../models/Therapist.js";
import Note from "../models/Note.js";
import Notification from "../models/Notification.js";
import Validator from "../utils/Validator.js";
import { ApiError } from "../utils/ApiError.js";

const therapist = new Therapist();
const noteModel = new Note();
const notificationModel = new Notification();

class TherapistController {
  async getTherapist(req, res, next) {
    try {
      const { id } = req.params;
      Validator.validateValue("therapist_id", id);
      const sanitizedId = parseInt(id, 10);
      const result = await therapist.getTherapist(sanitizedId);
      return res.status(200).json(result);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getTherapistPatients(req, res, next) {
    try {
      const { therapist_id } = req.query;
      Validator.validateValue("therapist_id", therapist_id);
      const sanitizedTherapistId = parseInt(therapist_id, 10);
      const patients = await therapist.getTherapistPatients(
        sanitizedTherapistId
      );
      if (patients.length < 1) {
        throw new ApiError(404, "No patient found linked to this therapist");
      }
      return res.status(200).json({ patients });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getNotes(req, res, next) {
    try {
      const { therapist_id, note_id, title, tag, dateFrom, dateTo } = req.query;
      Validator.validateValue("therapist_id", therapist_id);
      const sanitizedTherapistId = parseInt(therapist_id, 10);
      let sanitizedNoteId;
      if (note_id) {
        sanitizedNoteId = parseInt(note_id, 10);
      }
      const filters = { sanitizedNoteId, title, tag, dateFrom, dateTo };
      const result = await noteModel.getNotes(
        "therapist",
        sanitizedTherapistId,
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
      Validator.validateValue("patient_id", patient_id);
      Validator.validateValue("therapist_id", therapist_id);
      const sanitizedPatientId = parseInt(patient_id, 10);
      const sanitizedTherapistId = parseInt(therapist_id, 10);
      const notes = await noteModel.getPatientNotes(
        sanitizedPatientId,
        sanitizedTherapistId
      );
      return res.status(200).json(notes);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getNotesAboutPatient(req, res, next) {
    try {
      const { patient_id, therapist_id } = req.query;
      Validator.validateValue("patient_id", patient_id);
      Validator.validateValue("therapist_id", therapist_id);
      const sanitizedPatientId = parseInt(patient_id, 10);
      const sanitizedTherapistId = parseInt(therapist_id, 10);
      const notes = await noteModel.getNotesAboutPatient(
        sanitizedPatientId,
        sanitizedTherapistId
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
      Validator.validateValue("content", content);
      Validator.validateValue("title", title);
      Validator.validateValue("patient_id", patient_id);
      Validator.validateValue("therapist_id", therapist_id);
      const sanitizedPatientId = parseInt(patient_id, 10);
      const sanitizedTherapistId = parseInt(therapist_id, 10);
      await noteModel.postNote(
        "therapist",
        title,
        content,
        tags,
        sanitizedPatientId,
        sanitizedTherapistId
      );
      return res.status(200).json({ message: "Note posted successfully." });
    } catch (e) {
      next(e);
    }
  }

  async updateNote(req, res, next) {
    try {
      const body = req.body;
      const { content, tags, therapist_id, note_id } = body;
      Validator.validateValue("content", content);
      Validator.validateValue("therapist_id", therapist_id);
      Validator.validateValue("note_id", note_id);
      const sanitizedTherapistId = parseInt(therapist_id, 10);
      const sanitizedNoteId = parseInt(note_id, 10);
      await noteModel.updateNote(
        "therapist",
        sanitizedNoteId,
        "Patient note",
        content,
        tags,
        sanitizedTherapistId
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
      Validator.validateValue("therapist_id", therapist_id);
      Validator.validateValue("note_id", note_id);
      const sanitizedTherapistId = parseInt(therapist_id, 10);
      const sanitizedNoteId = parseInt(note_id, 10);
      await noteModel.deleteNote(
        "therapist",
        sanitizedNoteId,
        sanitizedTherapistId
      );
      return res.status(200).json({ message: "Note deleted successfully." });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getNotifications(req, res, next) {
    try {
      const { therapist_id } = req.query;
      Validator.validateValue("therapist_id", therapist_id);
      const sanitizedTherapistId = parseInt(therapist_id, 10);
      const result = await notificationModel.getNotifications(
        "therapist",
        sanitizedTherapistId
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
      Validator.validateValue("therapist_id", therapist_id);
      Validator.validateValue("patient_id", patient_id);
      Validator.validateValue("content", content);
      const sanitizedTherapistId = parseInt(therapist_id, 10);
      const sanitizedPatientId = parseInt(patient_id, 10);
      await notificationModel.postNotification(
        "therapist",
        sanitizedPatientId,
        content,
        sanitizedTherapistId
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
      Validator.validateValue("notification_id", notification_id);
      const sanitizedNotificationId = parseInt(notification_id, 10);
      await notificationModel.deleteNotification(
        "therapist",
        sanitizedNotificationId
      );
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
      Validator.validateValue("therapist_id", therapist_id);
      Validator.validateValue("patient_id", patient_id);
      const sanitizedTherapistId = parseInt(therapist_id, 10);
      const sanitizedPatientId = parseInt(patient_id, 10);
      const therapistData = await therapist.getTherapistBasicInfo(
        sanitizedTherapistId
      );
      await therapist.acceptPatient(sanitizedTherapistId, sanitizedPatientId);
      console.log(therapistData);
      await noteModel.postNote(
        "therapist",
        `New Patient Note`,
        '{"ops":[{"insert":"New note"}]}',
        null,
        sanitizedPatientId,
        sanitizedTherapistId
      );
      await notificationModel.postNotification(
        "patient",
        sanitizedPatientId,
        `The therapist ${therapistData[0].name} ${therapistData[0].surname} has accepted to link with you.`
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
      Validator.validateValue("therapist_id", therapist_id);
      Validator.validateValue("patient_id", patient_id);
      const sanitizedTherapistId = parseInt(therapist_id, 10);
      const sanitizedPatientId = parseInt(patient_id, 10);
      const patientData = await therapist.getPatientBasicInfo(
        sanitizedPatientId
      );
      const therapistData = await therapist.getTherapistBasicInfo(
        sanitizedTherapistId
      );
      const message =
        `The therapist ${therapistData[0].name} ${therapistData[0].surname} decided to ` +
        (patientData[0].therapist_id == therapist_id ? "interrupt" : "reject") +
        ` the link.`;
      await therapist.dischargePatient(sanitizedPatientId);
      try {
        let note;
        try {
          note = await noteModel.getNotesAboutPatient(
            sanitizedPatientId,
            sanitizedTherapistId
          );
        } catch (e) {
          console.log(e);
          if (e.statusCode == 404) {
            note = null;
          } else {
            throw e;
          }
        }
        if (note) {
          await noteModel.deleteNote(
            "therapist",
            note[0].id,
            sanitizedTherapistId
          );
        }
        await notificationModel.postNotification(
          "patient",
          sanitizedPatientId,
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
