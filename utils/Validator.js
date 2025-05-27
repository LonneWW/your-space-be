import { ApiError } from "./ApiError.js";
class Validator {
  static validateValue(name, value) {
    if (value == null || value == undefined || Number.isNaN(value)) {
      console.error(`${name} = ${value} is invalid.`);
      throw new ApiError(400);
    }
  }
}

export default Validator;
