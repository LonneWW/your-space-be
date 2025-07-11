import dotenv from "dotenv";
import { ApiError } from "../utils/ApiError.js";
dotenv.config();
function verifyProperty(req, res, next) {
  try {
    const userId = req.userId;
    const userRole = req.userRole;
    const method = req.method;
    let callUserId;
    if (method == "GET" || method == "DELETE") {
      if (userRole == "patient") {
        callUserId = req.query.patient_id;
      } else if (userRole == "therapist") {
        callUserId = req.query.therapist_id;
      }
    } else if (method == "POST" || method == "PUT") {
      if (userRole == "patient") {
        callUserId = req.body.patient_id;
      } else if (userRole == "therapist") {
        callUserId = req.body.therapist_id;
      }
    }
    if (callUserId != userId)
      throw new ApiError(401, "Access denied; operation blocked.");
    next();
  } catch (e) {
    console.error(e);
    next(e);
  }
}

export default verifyProperty;
