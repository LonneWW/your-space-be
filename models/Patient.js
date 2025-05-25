import QueryBuilder from "../utils/QueryBuilder.js";
import Validator from "../utils/Validator.js";
import Note from "./Note.js";
import Notification from "./Notification.js";

const noteModel = new Note();
const notificationModel = new Notification();
class Patient {
  async getTherapistsList() {
    const query = "SELECT * FROM Therapists;";
    return await QueryBuilder.query(query);
  }

  async changeTerapist(body) {
    Validator.validateValue("patient_id", body.patient_id);
    Validator.validateValue("therapist_id", body.therapist_id);
    const sanitizedId = parseInt(body.patient_id, 10);
    const sanitizedTherapistId = parseInt(body.therapist_id, 10);
    try {
      let query = "SELECT * FROM Patients WHERE id = ?";
      let params = [sanitizedId];
      let result = await QueryBuilder.query(query, params);
      result = result[0];
      return await this.postNotification("therapist", {
        therapist_id: sanitizedTherapistId,
        content: `The patient ${result.name} ${result.surname} would like to link with you.`,
        patient_id: sanitizedId,
      });
    } catch (e) {
      throw console.error(e);
    }
  }

  async changeTerapistToNull(body) {
    Validator.validateValue("patient_id", body.patient_id);
    Validator.validateValue("therapist_id", body.therapist_id);
    const sanitizedId = parseInt(body.patient_id, 10);
    const sanitizedTherapistId = parseInt(body.therapist_id, 10);
    let query = "UPDATE Patients SET therapist_id = null WHERE id = ?;";
    let params = [sanitizedId];
    try {
      await QueryBuilder.query(query, params);
      query = "SELECT * FROM Patients WHERE id = ?";
      let result = await QueryBuilder.query(query, params);
      result = result[0];
      console.log(result);
      return await this.postNotification("therapist", {
        therapist_id: sanitizedTherapistId,
        content: `The patient ${result.name} ${result.surname} decided to interrupt the link.`,
        patient_id: sanitizedId,
      });
    } catch (e) {
      throw console.error(e);
    }
  }

  // async getNotes(body) {
  //   return await noteModel.getNotes(body);
  // }

  // async createNote(role = "patient", body) {
  //   return await noteModel.postNote(role, body);
  // }

  // async updateNote(role = "patient", body) {
  //   return await noteModel.updateNote(role, body);
  // }

  // async deleteNote(role = "patient", body) {
  //   return await noteModel.deleteNote(role, body);
  // }

  // async updateNoteVisibility(body) {
  //   return await noteModel.updateNoteVisibility(body);
  // }

  // async getNotifications(table = "patient", body) {
  //   return await notificationModel.getNotifications(table, body);
  // }

  // async postNotification(table = "patient", body) {
  //   return await notificationModel.postNotification(table, body);
  // }

  // async deleteNotification(table = "patient", body) {
  //   return await notificationModel.deleteNotification(table, body);
  // }
}

export default Patient;
