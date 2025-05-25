import QueryBuilder from "../utils/QueryBuilder.js";
import Validator from "../utils/Validator.js";
class Note {
  async getNotes(id) {
    Validator.validateValue("id", id);
    const sanitizedId = parseInt(id, 10);
    const tableName = `_${sanitizedId}_Notes`;
    const query = `SELECT * FROM \`${tableName}\`;`;
    return await QueryBuilder.query(query);
  }

  async getPatientNotes(patient_id, therapist_id) {
    Validator.validateValue("patient_id", patient_id);
    Validator.validateValue("therapist_id", therapist_id);
    let result;
    try {
      const query = "SELECT * FROM Patients WHERE therapist_id = ?";
      const param = [therapist_id];
      result = await QueryBuilder.query(query, param);
    } catch (e) {
      throw console.error(e);
    }
    if (result[0].therapist_id == therapist_id) {
      const sanitizedId = parseInt(patient_id, 10);
      const tableName = `_${sanitizedId}_Notes`;
      const query = `SELECT * FROM \`${tableName}\` WHERE shared = 1;`;
      try {
        const result = await QueryBuilder.query(query);
        if (result.length < 1) {
          return { message: "No notes shared." };
        }
        return result;
      } catch (e) {
        if ((e.code = "ER_NO_SUCH_TABLE")) {
          return { message: "No notes shared." };
        }
        throw console.error(e);
      }
    } else {
      return { message: "Access denied." };
    }
  }

  async getNotesAboutPatient(body) {
    Validator.validateValue("therapist_id", body.therapist_id);
    Validator.validateValue("patient_id", body.patient_id);
    const sanitizedId = parseInt(body.therapist_id, 10);
    const sanitizedPatientId = parseInt(body.patient_id, 10);
    const tableName = `t_${sanitizedId}_Notes`;
    const query = `SELECT * FROM \`${tableName}\` WHERE patient_id = ?;`;
    console.log(query);
    const params = [sanitizedPatientId];
    try {
      const result = await QueryBuilder.query(query, params);
      if (result.length < 1) {
        return { message: "No notes available." };
      }
      return result;
    } catch (e) {
      if ((e.code = "ER_NO_SUCH_TABLE")) {
        return { message: "No notes available." };
      }
      throw console.error(e);
    }
  }

  async postNote(role, body) {
    console.log(body);
    Validator.validateValue("date", body.date);
    Validator.validateValue("content", body.content);
    Validator.validateValue("tags", body.tags);
    const sanitizedId = parseInt(body.id, 10);
    let tableName;
    let params;
    if (role == "patient") {
      Validator.validateValue("patient_id", body.patient_id);
      Validator.validateValue("shared", body.shared);
      tableName = `p_${sanitizedId}_Notes`;
      params = [
        null,
        sanitizedId,
        JSON.stringify(body.content),
        JSON.stringify(body.tags),
        body.date,
        body.shared,
      ];
    } else if (role == "therapist") {
      Validator.validateValue("therapist_id", body.therapist_id);
      Validator.validateValue("patient_id", body.patient_id);
      tableName = `t_${sanitizedId}_Notes`;
      const sanitizedPatientId = parseInt(body.patient_id, 10);
      params = [
        null,
        sanitizedPatientId,
        JSON.stringify(body.content),
        JSON.stringify(body.tags),
        body.date,
        sanitizedId,
      ];
    } else {
      throw console.error("Unrecognized user role");
    }
    await this.createNotesTable(role, tableName);
    let query = `INSERT INTO \`${tableName}\` VALUES (?, ?, ?, ?, ?, ?)`; //da modificare in base alle colonne delle tabelle
    return await QueryBuilder.query(query, params);
  }

  async updateNote(role, body) {
    Validator.validateValue("note_id", body.note_id);
    Validator.validateValue("content", body.content);
    Validator.validateValue("tags", body.tags);
    const sanitizedNoteId = parseInt(body.note_id, 10);
    let sanitizedId;
    let tableName;
    if (role == "patient") {
      Validator.validateValue("patient_id", body.patient_id);
      sanitizedId = parseInt(body.patient_id, 10);
      tableName = `p_${sanitizedId}_Notes`;
    } else {
      Validator.validateValue("therapist_id", body.therapist_id);
      sanitizedId = parseInt(body.therapist_id, 10);
      tableName = `t_${sanitizedId}_Notes`;
    }
    const query = `UPDATE \`${tableName}\` SET content = ?, tags = ? WHERE id = ?;`;
    let params = [
      JSON.stringify(body.content),
      JSON.stringify(body.tags),
      sanitizedNoteId,
    ];
    console.log(query);
    console.log(params);
    return await QueryBuilder.query(query, params);
  }

  async updateNoteVisibility(body) {
    Validator.validateValue("patient_id", body.patient_id);
    Validator.validateValue("note_id", body.note_id);
    Validator.validateValue("shared", body.shared);
    const sanitizedNoteId = parseInt(body.note_id, 10);
    const sanitizedPatientId = parseInt(body.patient_id, 10);
    const sanitizedShareValue = parseInt(body.shared, 10);
    const tableName = `_${sanitizedPatientId}_Notes`;
    const query = `UPDATE \`${tableName}\` SET shared = ? WHERE id = ?;`;
    let params = [sanitizedShareValue, sanitizedNoteId];
    return await QueryBuilder.query(query, params);
  }

  async deleteNote(role, body) {
    Validator.validateValue("note_id", body.note_id);
    const sanitizedNoteId = parseInt(body.note_id, 10);
    let sanitizedId;
    let tableName;
    if (role == "patient") {
      Validator.validateValue("patient_id", body.patient_id);
      sanitizedId = parseInt(body.patient_id, 10);
      tableName = `p_${sanitizedId}_Notes`;
    } else {
      Validator.validateValue("therapist_id", body.therapist_id);
      sanitizedId = parseInt(body.therapist_id, 10);
      tableName = `t_${sanitizedId}_Notes`;
    }
    const query = `DELETE FROM \`${tableName}\` WHERE id = ?;`;
    let params = [sanitizedNoteId];
    return await QueryBuilder.query(query, params);
  }

  async createNotesTable(role, tableName) {
    let query = this.queryToCreateNotesTableByRole(role, tableName);
    return await QueryBuilder.query(query);
  }

  queryToCreateNotesTableByRole(role, tableName) {
    let query = `CREATE TABLE IF NOT EXISTS \`${tableName}\` (
    id INT NOT NULL AUTO_INCREMENT,
    patient_id INT NOT NULL,
    content JSON NOT NULL, 
    tags JSON, 
    date DATETIME NOT NULL, 
    PRIMARY KEY (id)`;
    if (role == "patient") {
      query = query + `, shared BOOL NOT NULL);`;
    } else if (role == "therapist") {
      query = query + `, therapist_id INT NOT NULL);`;
    } else {
      throw console.error("Error creating note table");
    }
    return query;
  }
}

export default Note;
