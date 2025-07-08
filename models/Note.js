import QueryBuilder from "../utils/QueryBuilder.js";
import Validator from "../utils/Validator.js";
import { ApiError } from "../utils/ApiError.js";
class Note {
  async getNotes(role, id, filters = {}) {
    try {
      Validator.validateValue("id", id);
      const sanitizedId = parseInt(id, 10);
      const tableName =
        (role == "patient" ? "p" : "t") + `_${sanitizedId}_Notes`;
      let query =
        `SELECT id, patient_id, title, content, tags, date` +
        (role == "patient" ? ", shared" : "") +
        ` FROM \`${tableName}\` WHERE 1=1`;
      let params = [];

      if (filters) {
        // Se viene passato note_id, aggiungi la condizione per filtrare per id specifico
        if (filters.note_id) {
          query += " AND id = ?";
          params.push(filters.note_id);
        }
        // Filtra per title con LIKE
        if (filters.title) {
          query += " AND title LIKE CONCAT('%', ?, '%')";
          params.push(filters.title);
        }
        // Per il tag, puoi usare un LIKE simile – oppure, se il campo tags è un JSON valido,
        // potresti anche ricorrere a JSON_CONTAINS; qui usiamo LIKE per semplicità
        if (filters.tag) {
          // Con JSON_OBJECT, costruiamo dinamicamente il candidate JSON che vogliamo cercare all'interno del campo tags.
          query += " AND JSON_CONTAINS(tags, JSON_OBJECT('name', ?))";
          params.push(filters.tag);
        }
        // Per le date, puoi gestire il filtraggio per range
        if (filters.dateFrom && filters.dateTo) {
          query += " AND date BETWEEN ? AND ?";
          params.push(filters.dateFrom, filters.dateTo);
        } else if (filters.dateFrom) {
          query += " AND date >= ?";
          params.push(filters.dateFrom);
        } else if (filters.dateTo) {
          query += " AND date <= ?";
          params.push(filters.dateTo);
        }
      }

      query += " ORDER BY id ASC;";
      return await QueryBuilder.query(query, params);
    } catch (error) {
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
        "SELECT id, name, surname, therapist_id FROM Patients WHERE therapist_id = ? ORDER BY id ASC;";
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
      const tableName = `p_${sanitizedId}_Notes`;
      const query = `SELECT id, patient_id, title, content, tags, date FROM \`${tableName}\` WHERE shared = 1;`;
      try {
        const result = await QueryBuilder.query(query);
        if (result.length < 1) {
          return { message: "No notes shared." };
        }
        return result;
      } catch (e) {
        console.error(e);
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
    const query = `SELECT id, patient_id, title, content, date, therapist_id FROM \`${tableName}\` WHERE patient_id = ? ORDER BY id ASC;`;
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

  async postNote(role, title, content, tags, patient_id, therapist_id = null) {
    try {
      Validator.validateValue("title", title);
      Validator.validateValue("content", content);
      Validator.validateValue("patient_id", patient_id);
      const sanitizedId = parseInt(
        therapist_id ? therapist_id : patient_id,
        10
      );
      let tableName;
      let params;
      if (role == "patient") {
        tableName = `p_${sanitizedId}_Notes`;
        params = [
          null,
          sanitizedId,
          JSON.stringify(title),
          JSON.stringify(content),
          JSON.stringify(tags),
          0,
        ];
      } else if (role == "therapist") {
        Validator.validateValue("therapist_id", therapist_id);
        tableName = `t_${sanitizedId}_Notes`;
        const sanitizedPatientId = parseInt(patient_id, 10);
        params = [
          null,
          sanitizedPatientId,
          JSON.stringify(title),
          JSON.stringify(content),
          JSON.stringify(tags),
          sanitizedId,
        ];
      } else {
        throw new ApiError(400, "Couldn't get user role.");
      }
      let query = `INSERT INTO \`${tableName}\` VALUES (?, ?, ?, ?, ?, NOW(), ?)`; //da modificare in base alle colonne delle tabelle
      return await QueryBuilder.query(query, params);
    } catch (e) {
      console.log(e);
      throw new ApiError(500, "Couldn't post note, server-side error");
    }
  }

  async updateNote(role, note_id, title, content, tags, id) {
    try {
      Validator.validateValue("note_id", note_id);
      Validator.validateValue("title", title);
      Validator.validateValue("content", content);
      Validator.validateValue(role + "_id", id);
      const sanitizedNoteId = parseInt(note_id, 10);
      let sanitizedId = parseInt(id, 10);
      let tableName;
      if (role == "patient") {
        tableName = `p_${sanitizedId}_Notes`;
      } else {
        tableName = `t_${sanitizedId}_Notes`;
      }
      const query = `UPDATE \`${tableName}\` SET title = ?, content = ?, tags = ? WHERE id = ?;`;
      let params = [title, JSON.stringify(content), tags, sanitizedNoteId];
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
      const tableName = `p_${sanitizedPatientId}_Notes`;
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
    title VARCHAR(50) NOT NULL,
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

  setUserTable(role, id) {
    const sanitizedId = parseInt(id, 10);
    let tableName;
    if (role == "patient") {
      tableName = `p_${id}_Notes`;
    } else if (role == "therapist") {
      tableName = `t_${id}_Notes`;
    } else {
      throw new ApiError(400, "Couldn't get user role.");
    }
    let queryCreate = this.queryToCreateNotesTableByRole(role, tableName);
    let queryInsert =
      ` INSERT INTO \`${tableName}\` (id, title, content, date, patient_id` +
      (role == "patient" ? ", shared" : ", therapist_id") +
      `) VALUES (1, "Diary Note", "{}", NOW(), ` +
      (role == "patient" ? "?, false" : "0, ?") +
      ` )`;
    const query = queryCreate + queryInsert;
    const param = [sanitizedId];
    return QueryBuilder.query(query, param);
  }
}

export default Note;
