import bcrypt from "bcrypt";
import QueryBuilder from "../utils/QueryBuilder.js";
import { ApiError } from "../utils/ApiError.js";

const saltRounds = 10;

class Auth {
  async registerUser(role, name, surname, email, password) {
    try {
      let query =
        "SELECT id, name, surname FROM " +
        (role == "patient" ? "Patients" : "Therapists") +
        " WHERE email=?";
      let param = [email];
      const result = await QueryBuilder.query(query, param);
      if (result.length != 0) {
        throw new ApiError(409, "Email already linked to another account.");
      }
      query =
        "INSERT INTO " +
        (role == "patient" ? "Patients" : "Therapists") +
        " VALUES(?,?,?,?,";
      let params;
      const hash = await bcrypt.hash(password, saltRounds);
      if (role == "patient") {
        query = query + "?,?);";
        params = [null, name, surname, email, hash, null];
      } else {
        query = query + "?);";
        params = [null, name, surname, email, hash];
      }
      return QueryBuilder.query(query, params);
    } catch (error) {
      if (error.statusCode == 409) {
        throw error;
      }
      throw new ApiError(500, "Couldn't register user, server-side error");
    }
  }

  async loginUser(role, email, password) {
    try {
      let query =
        "SELECT password FROM" +
        (role == "patient" ? "Patients" : "Therapists") +
        "WHERE email=?";
      let param = [email];
      query =
        "SELECT id, name, surname FROM" +
        (role == "patient" ? "Patients" : "Therapists") +
        "WHERE email=?";
      const emailExists = await QueryBuilder.query(query, param);
      if (emailExists[0].length == 1) {
        const storedHash = await QueryBuilder.query(query, param);
        console.log(storedHash);
        const isMatch = await bcrypt.compare(password, storedHash);
        if (isMatch) {
          return emailExists[0];
        }
      } else {
        throw new ApiError(404, "The email is not registered.");
      }
    } catch (error) {
      throw new ApiError(500, "Couldn't log in, server-side error");
    }
  }
}

export default Auth;
