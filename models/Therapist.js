import QueryBuilder from "../utils/QueryBuilder.js";

class Therapist {
  async getTherapist(id) {
    const query = "SELECT id, name, surname FROM Therapists WHERE id = ?";
    const sanitizedId = parseInt(id, 10);
    const param = [sanitizedId];
    return QueryBuilder.query(query, param);
  }

  async getTherapistPatients(therapist_id) {
    const sanitizedId = parseInt(therapist_id, 10);
    const query =
      "SELECT id, name, surname FROM Patients WHERE therapist_id = ?;";
    const params = [sanitizedId];
    const result = await QueryBuilder.query(query, params);
    if (result.length < 1) {
      return { message: "No patients found." };
    }
  }

  async dischargePatient(therapist_id, patient_id) {
    const sanitizedId = parseInt(therapist_id, 10);
    const sanitizedPatientId = parseInt(patient_id, 10);
    let query = "UPDATE Patients SET therapist_id = null WHERE id = ?;";
    let params = [sanitizedPatientId];
    try {
      await QueryBuilder.query(query, params);
      query = "SELECT id, name, surname FROM Therapists WHERE id = ?";
      params = [sanitizedId];
      let result = await QueryBuilder.query(query, params);
      result = result[0];
      console.log(result);
      return await this.postNotification("patient", {
        patient_id: sanitizedPatientId,
        content: `The therapist ${result.name} ${result.surname} decided to interrupt the link.`,
      });
    } catch (e) {
      throw console.error(e);
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
      console.log(result);
      return await this.postNotification("patient", {
        patient_id: sanitizedPatientId,
        content: `The therapist ${result.name} ${result.surname} has accepted to link with you.`,
      });
    } catch (e) {
      throw console.error(e);
    }
  }
}
export default Therapist;
