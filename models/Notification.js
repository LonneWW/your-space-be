import QueryBuilder from "../utils/QueryBuilder.js";
import Validator from "../utils/Validator.js";

class Notification {
  async getNotifications(role, id) {
    let table = this.returnTableByRole(role);
    let condition;
    Validator.validateValue("id", id);
    let param = [id];
    if (role == "patient") {
      condition = "patient_id";
    } else if (role == "therapist") {
      condition = "therapist_id";
    } else {
      throw console.error("Unrecognized user role");
    }
    const sanitizedId = parseInt(param, 10);
    const query = `SELECT * FROM \`${table}\` WHERE \`${condition}\` = ?;`;
    const params = [sanitizedId];
    return await QueryBuilder.query(query, params);
  }

  async postNotification(role, patient_id, content, therapist_id = null) {
    const table = this.returnTableByRole(role);
    Validator.validateValue("patient_id", patient_id);
    Validator.validateValue("content", content);
    let params;
    if (role == "patient") {
      params = [parseInt(patient_id, 10), content];
    } else {
      Validator.validateValue("therapist_id", therapist_id);
      params = [parseInt(therapist_id, 10), content, patient_id];
    }
    let query =
      `INSERT INTO \`${table}\` VALUES (null, ?,` +
      (role == "patient" ? "" : ` ?, `) +
      `?);`;
    console.log(query);
    return QueryBuilder.query(query, params);
  }

  async deleteNotification(role, notification_id) {
    let table = this.returnTableByRole(role);
    Validator.validateValue("notification_id", notification_id);
    const sanitizedId = parseInt(notification_id);
    const query = `DELETE FROM \`${table}\` WHERE id = ?;`;
    const params = [sanitizedId];
    return await QueryBuilder.query(query, params);
  }

  returnTableByRole(role) {
    if (role == "patient") {
      return `Patients_Notifications`;
    } else if (role == "therapist") {
      return `Therapists_Notifications`;
    } else {
      throw console.error("Unrecognized user role");
    }
  }
}

export default Notification;
