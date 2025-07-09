import QueryBuilder from "../utils/QueryBuilder.js";
import Validator from "../utils/Validator.js";
import { ApiError } from "../utils/ApiError.js";

class Notification {
  async getNotifications(role, id) {
    try {
      let table = this.returnTableByRole(role);
      let condition;
      if (role == "patient") {
        condition = "patient_id";
      } else if (role == "therapist") {
        condition = "therapist_id";
      } else {
        throw console.error("Unrecognized user role");
      }
      const query = `SELECT * FROM \`${table}\` WHERE \`${condition}\` = ? ORDER BY id ASC;`;
      return await QueryBuilder.query(query, [id]);
    } catch (e) {
      console.log(e);
      throw new ApiError(
        500,
        "Couldn't get any notification, server-side error"
      );
    }
  }

  async postNotification(role, patient_id, content, therapist_id = null) {
    try {
      const table = this.returnTableByRole(role);
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
      return QueryBuilder.query(query, params);
    } catch (e) {
      console.log(e);
      throw new ApiError(
        500,
        "Couldn't post the notification, server-side error"
      );
    }
  }

  async deleteNotification(role, notification_id) {
    try {
      let table = this.returnTableByRole(role);
      const query = `DELETE FROM \`${table}\` WHERE id = ?;`;
      return await QueryBuilder.query(query, [notification_id]);
    } catch (e) {
      console.log(e);
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
      throw new ApiError(500, "Unrecognized user role");
    }
  }
}

export default Notification;
