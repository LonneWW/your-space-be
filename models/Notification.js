import QueryBuilder from "../utils/QueryBuilder.js";

class Notification {
  async getNotifications(role, body) {
    let table = this.returnTableByRole(role);
    let condition;
    let param;
    if (role == "patient") {
      condition = "patient_id";
      param = body.patient_id;
    } else if (role == "therapist") {
      condition = "therapist_id";
      param = body.therapist_id;
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
    let params;
    if (role == "patient") {
      params = [parseInt(body.patient_id, 10), body.content];
    } else {
      params = [parseInt(body.therapist_id, 10), body.content, body.patient_id];
    }
    let query =
      `INSERT INTO \`${table}\` VALUES (null, ?,` +
      (role == "patient" ? "" : `?, `) +
      `?);`;
    console.log(query);
    return QueryBuilder.query(query, params);
  }

  async deleteNotification(role, body) {
    let table = this.returnTableByRole(role);
    const sanitizedId = parseInt(body.id, 10);
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
