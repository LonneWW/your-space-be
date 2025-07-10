import dotenv from "dotenv";
import { ApiError } from "../utils/ApiError.js";
dotenv.config();
function verifyProperty(req, res, next) {
  try {
    // const token = req.cookies.accessToken;
    // if (!token)
    //   throw new ApiError(401, "Invalid Auth Token; operation blocked.");
    // const routeRole = req.baseUrl.slice(1);
    // let payload;
    // try {
    //   payload = jwt.verify(token, jwtKey);
    // } catch {
    //   throw new ApiError(401, "Invalid Auth Token; operation blocked.");
    // }
    // const { userRole } = payload;
    // if (routeRole !== userRole)
    //   throw new ApiError(401, "Access denied; operation blocked.");
    const userId = req.userId;
    const userRole = req.userRole;
    console.log(req.method);
    const method = req.method;
    let callUserId;
    if (method == "GET" || method == "DELETE") {
      if (userRole == "patient") {
        console.log(req.query.patient_id);
        callUserId = req.query.patient_id;
      } else if (userRole == "therapist") {
        console.log(req.query.therapist_id);
        callUserId = req.query.therapist_id;
      }
    } else if (method == "POST" || method == "PUT") {
      if (userRole == "patient") {
        console.log(req.body.patient_id);
        callUserId = req.body.patient_id;
      } else if (userRole == "therapist") {
        console.log(req.body.therapist_id);
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
