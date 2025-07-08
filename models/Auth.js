import QueryBuilder from "../utils/QueryBuilder.js";

class Auth {
  async registerUser(role, name, surname, email, hash) {
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

  // async loginUser(role, email, password) {
  //   try {
  //     let query =
  //       "SELECT id, name, surname, password " +
  //       (role == "patient"
  //         ? ", therapist_id FROM Patients"
  //         : "FROM Therapists") +
  //       " WHERE email=?";
  //     let param = [email];
  //     const userData = await QueryBuilder.query(query, param);
  //     if (userData.length == 1) {
  //       const storedHash = userData[0].password;
  //       const isMatch = await bcrypt.compare(password, storedHash);
  //       if (isMatch) {
  //         const body = userData[0];
  //         return {
  //           id: body.id,
  //           name: body.name,
  //           surname: body.surname,
  //           therapist_id: body.therapist_id,
  //         };
  //       } else {
  //         throw new ApiError(
  //           401,
  //           "The password is incorrect, please try again."
  //         );
  //       }
  //     } else {
  //       throw new ApiError(404, "The email is not registered.");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     if (error.statusCode) {
  //       throw error;
  //     }
  //     throw new ApiError(500, "Couldn't log in, server-side error");
  //   }
  // }
  async getUserBasicInfo(email, role) {
    const query =
      "SELECT id, name, surname" +
      (role == "patient"
        ? ", therapist_id FROM Patients"
        : " FROM Therapists") +
      " WHERE email = ?";
    return QueryBuilder.query(query, [email]);
  }

  async getUserCredentials(email, role) {
    const query =
      "SELECT id, name, surname, password" +
      (role == "patient"
        ? ", therapist_id FROM Patients"
        : " FROM Therapists") +
      " WHERE email = ?";
    return QueryBuilder.query(query, [email]);
  }

  async isLoggedIn(role, id, name, surname) {
    try {
      const query =
        "SELECT name, surname FROM " +
        (role == "patient" ? "Patients" : "Therapists") +
        " WHERE name = ? AND surname = ? AND id = ?";
      const params = [name, surname, id];
      const result = await QueryBuilder.query(query, params);
      return result;
    } catch (e) {
      console.log(e);
      throw new ApiError(500, "Couldn't verify logged user.");
    }
  }
}

export default Auth;
