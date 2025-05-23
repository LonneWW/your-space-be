import QueryBuilder from "../utils/QueryBuilder.js";

class Note {
  async getNotes(body) {
    const sanitizedId = parseInt(body.id, 10);
    const tableName = `_${sanitizedId}_Notes`;
    const query = `SELECT * FROM \`${tableName}\`;`;
    return await QueryBuilder.query(query);
  }

  async postNote(role, body) {
    const sanitizedId = parseInt(body.id, 10);
    const tableName = `_${sanitizedId}_Notes`;
    await this.createNotesTable(role, tableName);
    let query = `INSERT INTO \`${tableName}\` VALUES (?, ?, ?, ?, ?, ?)`; //da modificare in base alle colonne delle tabelle
    let params;
    if (role == "patient") {
      params = [
        sanitizedId,
        null,
        JSON.stringify(body.content),
        JSON.stringify(body.tags),
        body.date,
        body.shared,
      ];
    } else if (role == "therapist") {
      const sanitizedPatientId = parseInt(body.patient_id, 10);
      params = [
        sanitizedId,
        null,
        sanitizedPatientId,
        JSON.stringify(body.content),
        JSON.stringify(body.tags),
        body.date,
      ];
    } else {
      throw console.error("Unrecognized user role");
    }
    return await QueryBuilder.query(query, params);
  }

  async updateNote(body) {
    const sanitizedId = parseInt(body.id, 10);
    const sanitizedNoteId = parseInt(body.note_id, 10);
    const tableName = `_${sanitizedId}_Notes`;
    const query = `UPDATE \`${tableName}\` SET content = ?, tags = ? WHERE id = ?;`;
    let params = [
      JSON.stringify(body.content),
      JSON.stringify(body.tags),
      sanitizedNoteId,
    ];
    return await QueryBuilder.query(query, params);
  }

  async updateNoteVisibility(body) {
    const sanitizedNoteId = parseInt(body.id, 10);
    const sanitizedPatientId = parseInt(body.patient_id, 10);
    const sanitizedShareValue = parseInt(body.shared, 10);
    const tableName = `_${sanitizedPatientId}_Notes`;
    const query = `UPDATE \`${tableName}\` SET shared = ? WHERE id = ?;`;
    let params = [sanitizedShareValue, sanitizedNoteId];
    return await QueryBuilder.query(query, params);
  }

  async deleteNote(body) {
    const sanitizedId = parseInt(body.id, 10);
    const sanitizedNoteId = parseInt(body.note_id, 10);
    const tableName = `_${sanitizedId}_Notes`;
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
    patient_id INT NOT NULL,
    id INT NOT NULL AUTO_INCREMENT,
    content JSON NOT NULL, 
    tags JSON, 
    date DATETIME NOT NULL, 
    PRIMARY KEY (id)`;
    if (role == "patient") {
      query = query + `, shared BOOL NOT NULL);`;
    } else if (role == "therapist") {
      query = query + `);`;
    } else {
      throw console.error("Error creating note table");
    }
    return query;
  }
}

export default Note;
