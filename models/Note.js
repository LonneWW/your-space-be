import QueryBuilder from "../utils/QueryBuilder.js";
import Validator from "../utils/Validator.js";
import { ApiError } from "../utils/ApiError.js";
class Note {
  async getNotes(role, id, filters = {}) {
    try {
      const tableName = (role == "patient" ? "p" : "t") + `_${id}_Notes`;
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

  async getPatientNotes(patient_id) {
    try {
      const tableName = `p_${patient_id}_Notes`;
      const query = `SELECT id, patient_id, title, content, tags, date FROM \`${tableName}\` WHERE shared = 1;`;
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
  }

  async getNotesAboutPatient(patient_id, therapist_id) {
    const tableName = `t_${therapist_id}_Notes`;
    const query = `SELECT id, patient_id, title, content, date, therapist_id FROM \`${tableName}\` WHERE patient_id = ? ORDER BY id ASC;`;
    try {
      const result = await QueryBuilder.query(query, [patient_id]);
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
      const userId = therapist_id ? therapist_id : patient_id;
      let tableName;
      let params;
      if (role == "patient") {
        tableName = `p_${userId}_Notes`;
        params = [
          null,
          userId,
          JSON.stringify(title),
          JSON.stringify(content),
          JSON.stringify(tags),
          0,
        ];
      } else if (role == "therapist") {
        tableName = `t_${userId}_Notes`;
        params = [
          null,
          patient_id,
          JSON.stringify(title),
          JSON.stringify(content),
          JSON.stringify(tags),
          userId,
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

  async updateNote(role, note_id, title, content, tags, userId) {
    try {
      let tableName;
      if (role == "patient") {
        tableName = `p_${userId}_Notes`;
      } else {
        tableName = `t_${userId}_Notes`;
      }
      const query = `UPDATE \`${tableName}\` SET title = ?, content = ?, tags = ? WHERE id = ?;`;
      let params = [title, JSON.stringify(content), tags, note_id];
      return await QueryBuilder.query(query, params);
    } catch (e) {
      console.log(e);
      throw new ApiError(500, "Couldn't update note, server-side error");
    }
  }

  async updateNoteVisibility(patient_id, note_id, shared) {
    try {
      const tableName = `p_${patient_id}_Notes`;
      const query = `UPDATE \`${tableName}\` SET shared = ? WHERE id = ?;`;
      return await QueryBuilder.query(query, [shared, note_id]);
    } catch (e) {
      console.log(e);
      throw new ApiError(
        500,
        "Couldn't change note visibility, server-side error"
      );
    }
  }

  async deleteNote(role, note_id, userId) {
    try {
      let tableName;
      if (role == "patient") {
        tableName = `p_${userId}_Notes`;
      } else {
        tableName = `t_${userId}_Notes`;
      }
      const query = `DELETE FROM \`${tableName}\` WHERE id = ?;`;
      return await QueryBuilder.query(query, [note_id]);
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
    return QueryBuilder.query(query, [id]);
  }
}

export default Note;
