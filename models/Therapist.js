import QueryBuilder from "../utils/QueryBuilder.js";
import { ApiError } from "../utils/ApiError.js";
class Therapist {
  async getTherapist(id) {
    try {
      const query = "SELECT id, name, surname FROM Therapists WHERE id = ?";
      const sanitizedId = parseInt(id, 10);
      const param = [sanitizedId];
      return QueryBuilder.query(query, param);
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
      const sanitizedId = parseInt(therapist_id, 10);
      console.log(sanitizedId);
      const query =
        "SELECT id, name, surname FROM Patients WHERE therapist_id = ?;";
      const params = [sanitizedId];
      const result = await QueryBuilder.query(query, params);
      if (result.length < 1) {
        throw new ApiError(404, "No patient found linked to this therapist");
      }
      return result;
    } catch (e) {
      console.log(e);
      if (e.statusCode == 404) {
        throw e;
      } else {
        throw new ApiError(
          500,
          "Couldn't obtain therapist's patients, server-side error"
        );
      }
    }
  }

  async dischargePatient(therapist_id, patient_id) {
    const sanitizedId = parseInt(therapist_id, 10);
    const sanitizedPatientId = parseInt(patient_id, 10);
    //get patient data
    let query = "SELECT id, name, surname FROM Therapists WHERE id = ?";
    let param = [sanitizedId];
    let result = await QueryBuilder.query(query, param);
    result = result[0];
    //build response message
    let message =
      `The therapist ${result.name} ${result.surname} decided to ` +
      (result.id == therapist_id ? "interrupt" : "reject") +
      ` the link.`;
    //update patiente table
    query = "UPDATE Patients SET therapist_id = null WHERE id = ?;";
    param = [sanitizedPatientId];
    try {
      await QueryBuilder.query(query, param);
      return message;
    } catch {
      throw new ApiError(500, `Couldn't discharge patient, server-side error.`);
    }
  }

  async acceptPatient(therapist_id, patient_id) {
    const sanitizedId = parseInt(therapist_id, 10);
    const sanitizedPatientId = parseInt(patient_id, 10);
    let query = "UPDATE Patients SET therapist_id = ? WHERE id = ?;";
    let params = [sanitizedId, sanitizedPatientId];
    try {
      await QueryBuilder.query(query, params);
      query = "SELECT id, name, surname FROM Therapists WHERE id = ?";
      params = [sanitizedId];
      let result = await QueryBuilder.query(query, params);
      result = result[0];
      return result;
    } catch (e) {
      console.log(e);
      throw new ApiError(
        `Couldn't accept patient correctly, server-side error.`
      );
    }
  }
}
export default Therapist;
