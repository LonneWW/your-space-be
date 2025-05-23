import pool from "../config/database.js";

class QueryBuilder {
  static async query(query, parameters = []) {
    try {
      const results = await pool.query(query, parameters);
      const rows = results[0];
      return rows;
    } catch (e) {
      throw e;
    }
  }
}

export default QueryBuilder;
// module.exports = QueryBuilder;
