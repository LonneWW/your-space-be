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

  async postNotification(role, body) {
    const table = this.returnTableByRole(role);
    Validator.validateValue("patient_id", body.patient_id);
    Validator.validateValue("content", body.content);
    let params;
    if (role == "patient") {
      params = [parseInt(body.patient_id, 10), body.content];
    } else {
      Validator.validateValue("therapist_id", body.therapist_id);
      params = [parseInt(body.therapist_id, 10), body.content, body.patient_id];
    }
    let query =
      `INSERT INTO \`${table}\` VALUES (null, ?,` +
      (role == "patient" ? "" : ` ?, `) +
      `?);`;
    console.log(query);
    return QueryBuilder.query(query, params);
  }

  async deleteNotification(role, body) {
    let table = this.returnTableByRole(role);
    Validator.validateValue("id", body.id);
    const sanitizedId = parseInt(
      role == "patient" ? body.patient_id : body.therapist_id,
      10
    );
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
