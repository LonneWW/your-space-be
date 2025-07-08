import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Auth from "../models/Auth.js";
dotenv.config();

const auth = new Auth();
const saltRounds = Number(process.env.SALT_ROUNDS);

class AuthService {
  static async bycriptHash(password) {
    return bcrypt.hash(password, saltRounds);
  }

  static async bycriptCompare(password, storedHash) {
    const isMatch = await bcrypt.compare(password, storedHash);
    return isMatch;
  }

  static async verifyEmailIsUnused(email) {
    console.log(email);
    const emailInTherapists = await auth.getUserBasicInfo(email, "therapist");
    console.log(emailInTherapists);
    const emailInPatients = await auth.getUserBasicInfo(email, "patient");
    console.log(emailInPatients);
    if (emailInTherapists.length !== 0 || emailInPatients.length !== 0) {
      return false;
    }
    return true;
  }
}

export default AuthService;
