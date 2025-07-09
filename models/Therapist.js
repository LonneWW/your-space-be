import QueryBuilder from "../utils/QueryBuilder.js";
import { ApiError } from "../utils/ApiError.js";
class Therapist {
  async getTherapist(id) {
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

  async getTherapistPatients(therapist_id) {
    try {
      const query =
        "SELECT id, name, surname FROM Patients WHERE therapist_id = ? ORDER BY id ASC;";
      return await QueryBuilder.query(query, [therapist_id]);
    } catch (e) {
      console.log(e);
      throw new ApiError(
        500,
        "Couldn't obtain therapist's patients, server-side error"
      );
    }
  }

  async dischargePatient(patient_id) {
    try {
      const query = "UPDATE Patients SET therapist_id = null WHERE id = ?;";
      return await QueryBuilder.query(query, [patient_id]);
    } catch {
      throw new ApiError(500, `Couldn't discharge patient, server-side error.`);
    }
  }

  async acceptPatient(therapist_id, patient_id) {
    try {
      let query = "UPDATE Patients SET therapist_id = ? WHERE id = ?;";
      let params = [therapist_id, patient_id];
      await QueryBuilder.query(query, params);
    } catch (e) {
      console.log(e);
      throw new ApiError(
        `Couldn't accept patient correctly, server-side error.`
      );
    }
  }

  async getPatientBasicInfo(id) {
    const query =
      "SELECT name, surname, therapist_id FROM Patients WHERE id = ?";
    return QueryBuilder.query(query, [id]);
  }
  async getTherapistBasicInfo(id) {
    const query = "SELECT name, surname FROM Therapists WHERE id = ?";
    return QueryBuilder.query(query, [id]);
  }
}
export default Therapist;
