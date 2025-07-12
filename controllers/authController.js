import Auth from "../models/Auth.js";
import Note from "../models/Note.js";
import AuthService from "../services/authService.js";
import Validator from "../utils/Validator.js";
import { ApiError } from "../utils/ApiError.js";

class AuthController {
  async registerUser(role, req) {
    const body = req.body;
    const { name, surname, email, password } = body;
    Validator.validateValue("name", name);
    Validator.validateValue("surname", surname);
    Validator.validateValue("email", email);
    Validator.validateValue("password", password);
    const emailAvailability = await AuthService.verifyEmailIsUnused(email);
    if (!emailAvailability) {
      throw new ApiError(409, "Email already linked to another account.");
    }
    const hash = await AuthService.bycriptHash(password);
    await Auth.registerUser(role, name, surname, email, hash);
    return await this.loginUser(role, req);
  }
  async registerTherapist(req, res, next) {
    try {
      const userBasicInfo = await this.registerUser("therapist", req);
      return res.status(200).json(userBasicInfo);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async registerPatient(req, res, next) {
    try {
      const userBasicInfo = await this.registerUser("patient", req);
      return res.status(200).json(userBasicInfo);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async loginTherapist(req, res, next) {
    try {
      const userBasicInfo = await this.loginUser("therapist", req);
      const token = await AuthService.getToken(userBasicInfo.id, "therapist");
      return res
        .cookie("accessToken", token, {
          httpOnly: true,
          sameSite: "lax",
        })
        .status(200)
        .json(userBasicInfo);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async loginPatient(req, res, next) {
    try {
      const userBasicInfo = await this.loginUser("patient", req);
      const token = await AuthService.getToken(userBasicInfo.id, "patient");
      return res
        .cookie("accessToken", token, {
          httpOnly: true,
          sameSite: "lax",
        })
        .status(200)
        .json(userBasicInfo);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  async loginUser(role, req) {
    const body = req.body;
    const { email, password } = body;
    Validator.validateValue("email", email);
    Validator.validateValue("password", password);
    const credentials = await Auth.getUserCredentials(email, role);
    if (credentials.length != 1) {
      throw new ApiError(404, "The email is not registered.");
    }
    const storedHash = credentials[0].password;
    const isMatch = AuthService.bycriptCompare(password, storedHash);
    if (!isMatch) {
      throw new ApiError(401, "The password is incorrect, please try again.");
    }
    const userData = credentials[0];
    delete userData.password;
    return userData;
  }
}

export default AuthController;
