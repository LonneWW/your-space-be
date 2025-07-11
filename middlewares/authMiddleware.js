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
    const { userId, userRole } = payload;
    //since the call to check if the client has a token doesn't specify the user role
    //I removed this specific baseUrl from the control
    if (routeRole != "auth") {
      if (routeRole !== userRole)
        throw new ApiError(401, "Access denied; operation blocked.");
    }
    req.userId = userId;
    req.userRole = userRole;
    next();
  } catch (e) {
    console.error(e);
    next(e);
  }
}

export default verifyToken;
