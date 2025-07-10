import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Auth from "../models/Auth.js";
dotenv.config();

const saltRounds = Number(process.env.SALT_ROUNDS);
const jwtKey = process.env.JWT_SECRET;

class AuthService {
  static async bycriptHash(password) {
    return bcrypt.hash(password, saltRounds);
  }

  static async bycriptCompare(password, storedHash) {
    const isMatch = await bcrypt.compare(password, storedHash);
    return isMatch;
  }

  static async verifyEmailIsUnused(email) {
    const emailInTherapists = await Auth.getUserBasicInfo(email, "therapist");
    console.log(emailInTherapists);
    const emailInPatients = await Auth.getUserBasicInfo(email, "patient");
    console.log(emailInPatients);
    if (emailInTherapists.length !== 0 || emailInPatients.length !== 0) {
      return false;
    }
    return true;
  }

  static async getToken(id, role) {
    return jwt.sign({ userId: id, userRole: role }, jwtKey);
  }
}

export default AuthService;
