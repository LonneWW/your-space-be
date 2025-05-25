import QueryBuilder from "../utils/QueryBuilder.js";
import Note from "./Note.js";
import Notification from "./Notification.js";

const noteModel = new Note();
const notificationModel = new Notification();

class Therapist {
  async getTherapistPatients(therapist_id) {
    const sanitizedId = parseInt(therapist_id, 10);
    const query = "SELECT * FROM Patients WHERE therapist_id = ?;";
    const params = [sanitizedId];
    const result = await QueryBuilder.query(query, params);
    if (result.length < 1) {
      return { message: "No patients found." };
    }
  }

  async dischargePatient(body) {
    const sanitizedId = parseInt(body.therapist_id, 10);
    const sanitizedPatientId = parseInt(body.patient_id, 10);
    let query = "UPDATE Patients SET therapist_id = null WHERE id = ?;";
    let params = [sanitizedPatientId];
    try {
      await QueryBuilder.query(query, params);
      query = "SELECT * FROM Therapists WHERE id = ?";
      params = [sanitizedId];
      let result = await QueryBuilder.query(query, params);
      result = result[0];
      console.log(result);
      return await this.postNotification("patient", {
        patient_id: sanitizedPatientId,
        content: `The therapist ${result.name} ${result.surname} decided to interrupt the link.`,
      });
    } catch (e) {
      throw console.error(e);
    }
  }

  // async getPatientNotes(id) {
  //   return await noteModel.getPatientNotes(id);
  // }

  // async getNotesAboutPatient(body) {
  //   return await noteModel.getNotesAboutPatient(body);
  // }

  // async createNote(role = "therapist", body) {
  //   return await noteModel.postNote(role, body);
  // }

  // async updateNote(role = "therapist", body) {
  //   return await noteModel.updateNote(role, body);
  // }

  // async deleteNote(role = "therapist", body) {
  //   return await noteModel.deleteNote(role, body);
  // }

  // async getNotifications(table = "therapist", body) {
  //   return await notificationModel.getNotifications(table, body);
  // }

  // async postNotification(table = "therapist", body) {
  //   return await notificationModel.postNotification(table, body);
  // }

  // async deleteNotification(table = "therapist", body) {
  //   return await notificationModel.deleteNotification(table, body);
  // }

  async updatePatient(body) {
    const sanitizedId = parseInt(body.therapist_id, 10);
    const sanitizedPatientId = parseInt(body.patient_id, 10);
    let query = "UPDATE Patients SET therapist_id = ? WHERE id = ?;";
    let params = [sanitizedId, sanitizedPatientId];
    try {
      await QueryBuilder.query(query, params);
      query = "SELECT * FROM Therapists WHERE id = ?";
      params = [sanitizedId];
      let result = await QueryBuilder.query(query, params);
      result = result[0];
      console.log(result);
      return await this.postNotification("patient", {
        patient_id: sanitizedPatientId,
        content: `The therapist ${result.name} ${result.surname} has accepted to link with you.`,
      });
    } catch (e) {
      throw console.error(e);
    }
  }
}
export default Therapist;
