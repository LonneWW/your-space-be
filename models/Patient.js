import QueryBuilder from "../utils/QueryBuilder.js";
import Validator from "../utils/Validator.js";
import { ApiError } from "../utils/ApiError.js";

class Patient {
  async getTherapistsList() {
    try {
      const query = "SELECT id, name, surname FROM Therapists;";
      return await QueryBuilder.query(query);
    } catch {
      throw new ApiError(
        500,
        "Couldn't obtain therapists list, server-side error"
      );
    }
  }

  async getPatient(id) {
    try {
      const query =
        "SELECT id, name, surname, therapist_id FROM Patients WHERE id = ?";
      const sanitizedId = parseInt(id, 10);
      const param = [sanitizedId];
      return QueryBuilder.query(query, param);
    } catch {
      throw new ApiError(500, "Couldn't get patient data, server-side error");
    }
  }

  async selectTerapist(patient_id, therapist_id) {
    Validator.validateValue("patient_id", patient_id);
    Validator.validateValue("therapist_id", therapist_id);
    const sanitizedId = parseInt(patient_id, 10);
    const sanitizedTherapistId = parseInt(therapist_id, 10);
    let result = await this.getPatient(sanitizedId);
    result = result[0];
    return await this.postNotification("therapist", {
      therapist_id: sanitizedTherapistId,
      content: `The patient ${result.name} ${result.surname} would like to link with you.`,
      patient_id: sanitizedId,
    });
  }

  async changeTerapistToNull(patient_id, therapist_id) {
    Validator.validateValue("patient_id", patient_id);
    Validator.validateValue("therapist_id", therapist_id);
    const sanitizedId = parseInt(patient_id, 10);
    const sanitizedTherapistId = parseInt(therapist_id, 10);
    let query = "UPDATE Patients SET therapist_id = null WHERE id = ?;";
    let params = [sanitizedId];
    try {
      await QueryBuilder.query(query, params);
      query = "SELECT id, name, surname FROM Patients WHERE id = ?";
      let result = await QueryBuilder.query(query, params);
      result = result[0];
      console.log(result);
      return await this.postNotification("therapist", {
        therapist_id: sanitizedTherapistId,
        content: `The patient ${result.name} ${result.surname} decided to interrupt the link.`,
        patient_id: sanitizedId,
      });
    } catch (e) {
      throw new ApiError(500, "Couldn't unlink therapist, server-side error");
    }
  }
}

export default Patient;
