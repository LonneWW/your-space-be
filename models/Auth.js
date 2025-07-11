import QueryBuilder from "../utils/QueryBuilder.js";

class Auth {
  static async registerUser(role, name, surname, email, hash) {
    try {
      let query =
        "INSERT INTO " +
        (role == "patient" ? "Patients" : "Therapists") +
        " VALUES(?,?,?,?,";
      let params = [null, name, surname, email, hash];
      if (role == "patient") {
        query = query + "?,?);";
        params.push(null);
      } else {
        query = query + "?);";
      }
      await QueryBuilder.query(query, params);
    } catch (error) {
      console.error(error);
      if (error.statusCode == 409) {
        throw error;
      }
      throw new ApiError(500, "Couldn't register user, server-side error");
    }
  }

  static async getUserBasicInfo(email, role) {
    const query =
      "SELECT id, name, surname" +
      (role == "patient"
        ? ", therapist_id FROM Patients"
        : " FROM Therapists") +
      " WHERE email = ?";
    return QueryBuilder.query(query, [email]);
  }

  static async getUserCredentials(email, role) {
    const query =
      "SELECT id, name, surname, password" +
      (role == "patient"
        ? ", therapist_id FROM Patients"
        : " FROM Therapists") +
      " WHERE email = ?";
    return QueryBuilder.query(query, [email]);
  }
}

export default Auth;
