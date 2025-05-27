import Auth from "../models/Auth.js";

const auth = new Auth();

class AuthController {
  async registerTherapist(req, res, next) {
    try {
      const body = req.body;
      const { name, surname, email, password } = body;
      const result = await auth.registerUser(
        "therapist",
        name,
        surname,
        email,
        password
      );
      return res.status(200).json(result);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async registerPatient(req, res, next) {
    try {
      const body = req.body;
      const { name, surname, email, password } = body;
      const result = await auth.registerUser(
        "patient",
        name,
        surname,
        email,
        password
      );
      return res.status(200).json(result);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async loginTherapist(req, res, next) {
    try {
      const body = req.body;
      const { email, password } = body;
      const result = await auth.loginUser("therapist", email, password);
      return res.status(200).json(result);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async loginPatient(req, res, next) {
    try {
      const body = req.body;
      const { email, password } = body;
      const result = await auth.loginUser("patient", email, password);
      return res.status(200).json(result);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
}

export default AuthController;
