import QueryBuilder from "../utils/QueryBuilder.js";
import Validator from "../utils/Validator.js";
import { ApiError } from "../utils/ApiError.js";
class Note {
  async getNotes(id) {
    try {
      Validator.validateValue("id", id);
      const sanitizedId = parseInt(id, 10);
      const tableName = `_${sanitizedId}_Notes`;
      const query = `SELECT * FROM \`${tableName}\`;`;
      return await QueryBuilder.query(query);
    } catch {
      console.error(error);
      throw new ApiError(500, "Couldn't get notes, server-side error");
    }
  }

  async getPatientNotes(patient_id, therapist_id) {
    Validator.validateValue("patient_id", patient_id);
    Validator.validateValue("therapist_id", therapist_id);
    let result;
    try {
      const query =
        "SELECT id, name, surname FROM Patients WHERE therapist_id = ?";
      const param = [therapist_id];
      result = await QueryBuilder.query(query, param);
    } catch (e) {
      console.error(error);
      throw new ApiError(
        500,
        "Couldn't get user data in order to obtain notes, server-side error"
      );
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
        console.error(error);
        if ((e.code = "ER_NO_SUCH_TABLE")) {
          return { message: "No notes shared." };
        }
        throw new ApiError(404, "No notes available");
      }
    } else {
      throw new ApiError(401);
    }
  }

  async getNotesAboutPatient(patient_id, therapist_id) {
    Validator.validateValue("therapist_id", therapist_id);
    Validator.validateValue("patient_id", patient_id);
    const sanitizedId = parseInt(therapist_id, 10);
    const sanitizedPatientId = parseInt(patient_id, 10);
    const tableName = `t_${sanitizedId}_Notes`;
    const query = `SELECT * FROM \`${tableName}\` WHERE patient_id = ?;`;
    const params = [sanitizedPatientId];
    try {
      const result = await QueryBuilder.query(query, params);
      if (result.length < 1) {
        throw new ApiError(404, "No notes available");
      }
      return result;
    } catch (e) {
      console.log(e);
      if ((e.code = "ER_NO_SUCH_TABLE")) {
        throw new ApiError(404, "No notes available");
      }
      throw new ApiError(500, "Couldn't get notes, server-side error");
    }
  }

  async postNote(role, content, tags, patient_id, therapist_id = null) {
    try {
      Validator.validateValue("content", content);
      Validator.validateValue("tags", tags);
      Validator.validateValue("patient_id", patient_id);
      const sanitizedId = parseInt(
        therapist_id ? therapist_id : patient_id,
        10
      );
      let tableName;
      let params;
      if (role == "patient") {
        Validator.validateValue("shared", shared);
        tableName = `p_${sanitizedId}_Notes`;
        params = [
          null,
          sanitizedId,
          JSON.stringify(content),
          JSON.stringify(tags),
          shared,
        ];
      } else if (role == "therapist") {
        Validator.validateValue("therapist_id", therapist_id);
        tableName = `t_${sanitizedId}_Notes`;
        const sanitizedPatientId = parseInt(patient_id, 10);
        params = [
          null,
          sanitizedPatientId,
          JSON.stringify(content),
          JSON.stringify(tags),
          sanitizedId,
        ];
      } else {
        throw new ApiError(400, "Couldn't get user role.");
      }
      await this.createNotesTable(role, tableName);
      let query = `INSERT INTO \`${tableName}\` VALUES (?, ?, ?, ?, NOW(), ?)`; //da modificare in base alle colonne delle tabelle
      return await QueryBuilder.query(query, params);
    } catch (e) {
      console.log(e);
      throw new ApiError(500, "Couldn't post note, server-side error");
    }
  }

  async updateNote(role, note_id, content, tags, id) {
    try {
      Validator.validateValue("note_id", note_id);
      Validator.validateValue("content", content);
      Validator.validateValue("tags", tags);
      Validator.validateValue(role + "_id", id);
      const sanitizedNoteId = parseInt(note_id, 10);
      let sanitizedId = parseInt(patient_id, 10);
      let tableName;
      if (role == "patient") {
        sanitizedId = parseInt(patient_id, 10);
        tableName = `p_${sanitizedId}_Notes`;
      } else {
        Validator.validateValue("therapist_id", therapist_id);
        sanitizedId = parseInt(therapist_id, 10);
        tableName = `t_${sanitizedId}_Notes`;
      }
      const query = `UPDATE \`${tableName}\` SET content = ?, tags = ? WHERE id = ?;`;
      let params = [
        JSON.stringify(content),
        JSON.stringify(tags),
        sanitizedNoteId,
      ];
      console.log(query);
      console.log(params);
      return await QueryBuilder.query(query, params);
    } catch (e) {
      console.log(e);
      throw new ApiError(500, "Couldn't update note, server-side error");
    }
  }

  async updateNoteVisibility(patient_id, note_id, shared) {
    try {
      Validator.validateValue("patient_id", patient_id);
      Validator.validateValue("note_id", note_id);
      Validator.validateValue("shared", shared);
      const sanitizedNoteId = parseInt(note_id, 10);
      const sanitizedPatientId = parseInt(patient_id, 10);
      const sanitizedShareValue = parseInt(shared, 10);
      const tableName = `_${sanitizedPatientId}_Notes`;
      const query = `UPDATE \`${tableName}\` SET shared = ? WHERE id = ?;`;
      let params = [sanitizedShareValue, sanitizedNoteId];
      return await QueryBuilder.query(query, params);
    } catch (e) {
      console.log(e);
      throw new ApiError(
        500,
        "Couldn't change note visibility, server-side error"
      );
    }
  }

  async deleteNote(role, note_id, id) {
    try {
      Validator.validateValue("note_id", note_id);
      Validator.validateValue(role + "_id", id);
      const sanitizedNoteId = parseInt(note_id, 10);
      let sanitizedId = parseInt(id, 10);
      let tableName;
      if (role == "patient") {
        tableName = `p_${sanitizedId}_Notes`;
      } else {
        tableName = `t_${sanitizedId}_Notes`;
      }
      const query = `DELETE FROM \`${tableName}\` WHERE id = ?;`;
      let params = [sanitizedNoteId];
      return await QueryBuilder.query(query, params);
    } catch (e) {
      console.log(e);
      throw new ApiError(500, "Couldn't delete note, server-side error");
    }
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
