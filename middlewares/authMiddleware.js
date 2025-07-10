import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ApiError } from "../utils/ApiError.js";
dotenv.config();
const jwtKey = process.env.JWT_SECRET;
function verifyToken(req, res, next) {
  try {
    const token = req.cookies.accessToken;
    if (!token)
      throw new ApiError(401, "Invalid Auth Token; operation blocked.");
    const routeRole = req.baseUrl.slice(1);
    let payload;
    try {
      payload = jwt.verify(token, jwtKey);
    } catch {
      throw new ApiError(401, "Invalid Auth Token; operation blocked.");
    }
    const { userRole } = payload;
    if (routeRole !== userRole)
      throw new ApiError(401, "Access denied; operation blocked.");
    next();
  } catch (e) {
    console.error(e);
    next(e);
  }
}

export default verifyToken;
