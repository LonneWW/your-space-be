import express from "express";
import QueryBuilder from "../utils/QueryBuilder.js";
import Note from "./Note.js";
import Notification from "./Notification.js";

const app = express();
const noteModel = new Note();
const notificationModel = new Notification();
class Patient {
  async getTherapistsList() {
    const query = "SELECT * FROM Therapists;";
    return await QueryBuilder.query(query);
  }

  async changeTerapistToNull(body) {
    const sanitizedId = parseInt(body.id, 10);
    const query = "UPDATE Patients SET therapist_id = null WHERE id = ?;";
    const params = [sanitizedId];
    return await QueryBuilder.query(query, params);
    //INVIO NOTIFICA
    //AL THERAPIST
  }

  async getNotes(body) {
    return await noteModel.getNotes(body);
  }

  async createNote(role = "patient", body) {
    return await noteModel.postNote(role, body);
  }

  async updateNote(body) {
    return await noteModel.updateNote(body);
  }

  async deleteNote(body) {
    return await noteModel.deleteNote(body);
  }

  async updateNoteVisibility(body) {
    return await noteModel.updateNoteVisibility(body);
  }

  async getNotifications(role = "patient", body) {
    return await notificationModel.getNotifications(role, body);
  }

  async postNotification(role = "patient", body) {
    return await notificationModel.postNotification(role, body);
  }

  async deleteNotification(role = "patient", body) {
    return await notificationModel.deleteNotification(role, body);
  }
}

export default Patient;
