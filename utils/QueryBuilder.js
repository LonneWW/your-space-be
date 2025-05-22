import pool from "../config/database";

class QueryBuilder {
  static async query(query, parameters = []) {
    return pool.query(query, parameters);
  }
}

module.exports = QueryBuilder;
