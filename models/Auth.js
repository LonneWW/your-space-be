import bcrypt from "bcrypt";
import QueryBuilder from "../utils/QueryBuilder.js";
import { ApiError } from "../utils/ApiError.js";

const saltRounds = 10;

class Auth {
  async registerUser(role, name, surname, email, password) {
    try {
      this.checkIfEmailIsAlreadyUsed(email);
      let query =
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
      let result = await QueryBuilder.query(query, params);
      return this.getUserData(role, email);
    } catch (error) {
      console.error(error);
      if (error.statusCode == 409) {
        throw error;
      }
      throw new ApiError(500, "Couldn't register user, server-side error");
    }
  }

  async loginUser(role, email, password) {
    try {
      let query =
        "SELECT id, name, surname, password " +
        (role == "patient"
          ? ", therapist_id FROM Patients"
          : "FROM Therapists") +
        " WHERE email=?";
      let param = [email];
      const userData = await QueryBuilder.query(query, param);
      if (userData.length == 1) {
        const storedHash = userData[0].password;
        console.log("stored has:" + storedHash);
        console.log("password inserita:" + password);
        const isMatch = await bcrypt.compare(password, storedHash);
        if (isMatch) {
          const body = userData[0];
          return {
            id: body.id,
            name: body.name,
            surname: body.surname,
            therapist_id: body.therapist_id,
          };
        }
      } else {
        throw new ApiError(404, "The email is not registered.");
      }
    } catch (error) {
      console.error(error);
      throw new ApiError(500, "Couldn't log in, server-side error");
    }
  }
  async getUserData(role, email) {
    const query =
      "SELECT id, name, surname" +
      (role == "patient"
        ? ", therapist_id FROM Patients"
        : " FROM Therapists") +
      " WHERE email = ?";
    const param = [email];
    return QueryBuilder.query(query, param);
  }

  async checkIfEmailIsAlreadyUsed(email) {
    let query = "SELECT id, name, surname FROM Patients WHERE email=?";
    let param = [email];
    let result = await QueryBuilder.query(query, param);
    if (result.length != 0) {
      throw new ApiError(409, "Email already linked to another account.");
    }
    query = "SELECT id, name, surname FROM Therapists WHERE email=?";
    param = [email];
    result = await QueryBuilder.query(query, param);
    if (result.length != 0) {
      throw new ApiError(409, "Email already linked to another account.");
    }
  }

  async isLoggedIn(role, id, name, surname) {
    console.log(role, id, name, surname);
    try {
      const query =
        "SELECT name, surname FROM " +
        (role == "patient" ? "Patients" : "Therapists") +
        " WHERE name = ? AND surname = ? AND id = ?";
      console.log(query);
      const params = [name, surname, id];
      console.log(params);
      const result = await QueryBuilder.query(query, params);
      console.log(result);
      return result;
    } catch (e) {
      console.log(e);
      throw new ApiError(500, "Couldn't verify logged user.");
    }
  }
}

export default Auth;
