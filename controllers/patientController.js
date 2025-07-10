import Patient from "../models/Patient.js";
import Note from "../models/Note.js";
import Notification from "../models/Notification.js";
import Validator from "../utils/Validator.js";

class PatientController {
  async getTherapists(req, res, next) {
    try {
      const therapists = await Patient.getTherapistsList();
      return res.status(200).json(therapists);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getTherapist(req, res, next) {
    try {
      const { id } = req.params;
      Validator.validateValue("therapist_id", id);
      const sanitizedId = parseInt(id, 10);
      const result = await Patient.getTherapist(sanitizedId);
      return res.status(200).json(result);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getPatient(req, res, next) {
    try {
      const { id } = req.params;
      Validator.validateValue("id", id);
      const sanitizedId = parseInt(id, 10);
      const result = await Patient.getPatient(sanitizedId);
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
      Validator.validateValue("patient_id", patient_id);
      Validator.validateValue("therapist_id", patient_id);
      const sanitizedPatientId = parseInt(patient_id, 10);
      const sanitizedTherapistId = parseInt(therapist_id, 10);
      await Patient.changeTherapistToPending(sanitizedPatientId);
      const patientDataArray = await Patient.getPatient(sanitizedPatientId);
      await Notification.postNotification(
        "therapist",
        sanitizedPatientId,
        `The patient ${patientDataArray[0].name} ${patientDataArray[0].surname} would like to link with you.`,
        sanitizedTherapistId
      );
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
      Validator.validateValue("patient_id", patient_id);
      Validator.validateValue("therapist_id", patient_id);
      const sanitizedPatientId = parseInt(patient_id, 10);
      const sanitizedTherapistId = parseInt(therapist_id, 10);
      await Patient.changeTerapistToNull(sanitizedPatientId);
      const patientDataArray = await Patient.getPatient(sanitizedPatientId);
      const message = `The patient ${patientDataArray[0].name} ${patientDataArray[0].surname} decided to interrupt the link.`;
      try {
        let note;
        try {
          note = await Note.getNotesAboutPatient(
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
          await Note.deleteNote("therapist", note[0].id, sanitizedTherapistId);
        }
        await Notification.postNotification(
          "therapist",
          sanitizedPatientId,
          message,
          sanitizedTherapistId
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
        .json({ message: "You have successfully removed your therapist." });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async getNotes(req, res, next) {
    try {
      const { patient_id, note_id, title, tag, dateFrom, dateTo } = req.query;
      Validator.validateValue("patient_id", patient_id);
      const sanitizedPatientId = parseInt(patient_id, 10);
      let sanitizedNoteId;
      if (note_id) {
        sanitizedNoteId = parseInt(note_id, 10);
      }
      const filters = { sanitizedNoteId, title, tag, dateFrom, dateTo };
      const result = await Note.getNotes(
        "patient",
        sanitizedPatientId,
        filters
      );
      return res.status(200).json(result);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async postNote(req, res, next) {
    try {
      const body = req.body;
      const { content, title, tags, patient_id } = body;
      Validator.validateValue("content", content);
      Validator.validateValue("title", title);
      Validator.validateValue("patient_id", patient_id);
      const sanitizedPatientId = parseInt(patient_id, 10);
      await Note.postNote("patient", title, content, tags, sanitizedPatientId);
      return res.status(200).json({ message: "Note posted successfully." });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async updateNote(req, res, next) {
    try {
      const body = req.body;
      const { note_id, title, content, tags, patient_id } = body;
      Validator.validateValue("note_id", note_id);
      Validator.validateValue("title", title);
      Validator.validateValue("content", content);
      Validator.validateValue("patient_id", patient_id);
      const sanitizedPatientId = parseInt(patient_id, 10);
      const sanitizedNoteId = parseInt(note_id, 10);
      await Note.updateNote(
        "patient",
        sanitizedNoteId,
        title,
        content,
        tags,
        sanitizedPatientId
      );
      return res.status(200).json({ message: "Note updated successfully." });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async deleteNote(req, res, next) {
    try {
      const { note_id, patient_id } = req.query;
      Validator.validateValue("note_id", note_id);
      Validator.validateValue("patient_id", patient_id);
      const sanitizedNoteId = parseInt(note_id, 10);
      const sanitizedPatientId = parseInt(patient_id, 10);
      await Note.deleteNote("patient", sanitizedNoteId, sanitizedPatientId);
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
      Validator.validateValue("patient_id", patient_id);
      Validator.validateValue("note_id", note_id);
      Validator.validateValue("shared", shared);
      const sanitizedNoteId = parseInt(note_id, 10);
      const sanitizedPatientId = parseInt(patient_id, 10);
      const sanitizedShareValue = parseInt(shared, 10);
      await Note.updateNoteVisibility(
        sanitizedPatientId,
        sanitizedNoteId,
        sanitizedShareValue
      );
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
      Validator.validateValue("patient_id", patient_id);
      const sanitizedPatientId = parseInt(patient_id, 10);
      const result = await Notification.getNotifications(
        "patient",
        sanitizedPatientId
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
      Validator.validateValue("patient_id", patient_id);
      Validator.validateValue("content", content);
      const sanitizedPatientId = parseInt(patient_id, 10);
      await Notification.postNotification(
        "patient",
        sanitizedPatientId,
        content
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
      await Notification.deleteNotification("patient", sanitizedNotificationId);
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
