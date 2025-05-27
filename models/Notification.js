import QueryBuilder from "../utils/QueryBuilder.js";
import Validator from "../utils/Validator.js";
import { ApiError } from "../utils/ApiError.js";

class Notification {
  async getNotifications(role, id) {
    try {
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
    } catch {
      throw new ApiError(
        500,
        "Couldn't get any notification, server-side error"
      );
    }
  }

  async postNotification(role, patient_id, content, therapist_id = null) {
    try {
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
    } catch {
      throw new ApiError(
        500,
        "Couldn't post the notification, server-side error"
      );
    }
  }

  async deleteNotification(role, notification_id) {
    try {
      let table = this.returnTableByRole(role);
      Validator.validateValue("notification_id", notification_id);
      const sanitizedId = parseInt(notification_id);
      const query = `DELETE FROM \`${table}\` WHERE id = ?;`;
      const params = [sanitizedId];
      return await QueryBuilder.query(query, params);
    } catch {
      throw new ApiError(
        500,
        "Couldn't delete the notification, server-side error"
      );
    }
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
