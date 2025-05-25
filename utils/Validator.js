class Validator {
  static validateValue(name, value) {
    if (value == null || value == undefined || Number.isNaN(value)) {
      throw console.error(`${name} = ${value} is invalid.`);
    }
  }
}

export default Validator;
