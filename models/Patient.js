import QueryBuilder from "../utils/QueryBuilder.js";
import { ApiError } from "../utils/ApiError.js";

class Patient {
  static async getTherapistsList() {
    try {
      const query = "SELECT id, name, surname FROM Therapists;";
      return await QueryBuilder.query(query);
    } catch (e) {
      console.log(e);
      throw new ApiError(
        500,
        "Couldn't obtain therapists list, server-side error"
      );
    }
  }

  static async getTherapist(id) {
    try {
      const query = "SELECT id, name, surname FROM Therapists WHERE id = ?";
      return QueryBuilder.query(query, [id]);
    } catch (e) {
      console.log(e);
      throw new ApiError(
        500,
        "Couldn't obtain therapists data, server-side error"
      );
    }
  }

  static async getPatient(id) {
    try {
      const query =
        "SELECT id, name, surname, therapist_id FROM Patients WHERE id = ?";
      return QueryBuilder.query(query, [id]);
    } catch (e) {
      console.log(e);
      throw new ApiError(500, "Couldn't get patient data, server-side error");
    }
  }

  static async changeTherapistToPending(patient_id) {
    try {
      let query = "UPDATE Patients SET therapist_id = 0 WHERE id = ?;";
      return QueryBuilder.query(query, [patient_id]);
    } catch (e) {
      console.log(e);
      throw new ApiError(
        500,
        "Couldn't set therapist status to 'pending', server-side error"
      );
    }
  }

  static async changeTerapistToNull(patient_id) {
    try {
      let query = "UPDATE Patients SET therapist_id = null WHERE id = ?;";
      await QueryBuilder.query(query, [patient_id]);
    } catch (e) {
      throw new ApiError(500, "Couldn't unlink therapist, server-side error");
    }
  }
}

export default Patient;
