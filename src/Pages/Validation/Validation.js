import moment from 'moment';

export const CheckIDNumber = (ID) => {

  const validateID = (ID) => {
    const idRegex = /^[0-9]{13}$/;
    return idRegex.test(ID);
  };

  const CalcSumOfString = (valueToSum) => {
    var lengthOfString = valueToSum.length;
    var sumOfString = 0;
    for (var i = 0; i < lengthOfString; i++) {
      sumOfString += parseInt(valueToSum.substr(i, 1), 10);
    }
    return sumOfString;
  };

  const SAIDCheck = (IdNumber, setErrors) => {
    var d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13;
    var evsum = 0;
    var odsum = 0;
    var evnum1, evnum2, evnum3, evnum4, evnum5, evnum6;
    var checkDigit = 0;

    if (IdNumber.length === 13) {
      d1 = parseInt(IdNumber.substr(0, 1), 10);
      d2 = parseInt(IdNumber.substr(1, 1), 10);
      d3 = parseInt(IdNumber.substr(2, 1), 10);
      d4 = parseInt(IdNumber.substr(3, 1), 10);
      d5 = parseInt(IdNumber.substr(4, 1), 10);
      d6 = parseInt(IdNumber.substr(5, 1), 10);
      d7 = parseInt(IdNumber.substr(6, 1), 10);
      d8 = parseInt(IdNumber.substr(7, 1), 10);
      d9 = parseInt(IdNumber.substr(8, 1), 10);
      d10 = parseInt(IdNumber.substr(9, 1), 10);
      d11 = parseInt(IdNumber.substr(10, 1), 10);
      d12 = parseInt(IdNumber.substr(11, 1), 10);
      d13 = parseInt(IdNumber.substr(12, 1), 10);

      evnum1 = d2 * 2;
      evnum2 = d4 * 2;
      evnum3 = d6 * 2;
      evnum4 = d8 * 2;
      evnum5 = d10 * 2;
      evnum6 = d12 * 2;

      evsum =
        CalcSumOfString(evnum1.toString()) +
        CalcSumOfString(evnum2.toString()) +
        CalcSumOfString(evnum3.toString()) +
        CalcSumOfString(evnum4.toString()) +
        CalcSumOfString(evnum5.toString()) +
        CalcSumOfString(evnum6.toString());

      odsum = d1 + d3 + d5 + d7 + d9 + d11;

      if ((evsum + odsum) % 10 === 0) checkDigit = 0;
      else checkDigit = 10 - ((evsum + odsum) % 10);

      return checkDigit === d13;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, ID: "Invalid ID number" }));
      return false;
    }
  };

  const idValidationService = {
    checkNumber: (num) => {
      const result = {
        dob: null,
        age: null,
        gender: null,
        citizenship: null,
        race: null,
        error: null,
        isValid: null,
      };

      if (!validateID(num)) {
        result.error = "Invalid ID Number - does not match the required format.";
        return result;
      }

      const substrings = {
        dob: num.substring(0, 6),
        gender: num.substring(6, 7),
        citizenship: num.substring(10, 11),
        race: num.substring(11, 12),
      };

      const id = num;
      const yy = id.substring(0, 2);
      let cc = "19";
      if (parseInt(yy, 10) <= moment().format("YY")) {
        cc = "20";
      }
      const ccyy = cc + yy;
      const mm = id.substring(2, 4);
      const dd = id.substring(4, 6);
      const dob = ccyy + "-" + mm + "-" + dd;
      result.dob = new Date(moment(dob, "YYYY-MM-DD"));
      result.age = moment().diff(dob, "years");

      if (isNaN(result.age)) {
        result.error = "Invalid ID Number - age could not be determined";
        return result;
      }

      const genderDigit = parseInt(substrings.gender, 10);
      if (genderDigit >= 0 && genderDigit <= 4) result.gender = "Female";
      else if (genderDigit >= 5 && genderDigit <= 9) result.gender = "Male";
      else {
        result.error = "Invalid ID Number - gender could not be determined";
        return result;
      }

      const citizenshipDigit = parseInt(substrings.citizenship, 10);
      switch (citizenshipDigit) {
        case 0:
          result.citizenship = "SA Citizen";
          break;
        case 1:
          result.citizenship = "Non-SA Citizen";
          break;
        case 2:
          result.citizenship = "Refugee";
          break;
        default:
          result.error = "Invalid ID Number - citizenship could not be determined";
          return result;
      }

      const raceDigit = parseInt(substrings.race, 10);
      switch (raceDigit) {
        case 8:
          result.race = "White";
          break;
        case 9:
          result.race = "Black";
          break;
        default:
          result.race = null;
      }

      result.isValid = SAIDCheck(num, (errors) => result.error = errors.ID);

      return result;
    },
  };

  return idValidationService.checkNumber(ID);
};


export const validateRequired = (value) => {
  return !!value; 
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email); 
};

export const validatePassword = (password) => {
  return password.length >= 8; 
};

export const validateMatch = (value1, value2) => {
  return value1 === value2; 
};


export const validateSurname = (surname) =>{
 
  const surnamePattern = /^[A-Za-z]+(['-][A-Za-z]+)*$/;

  return surnamePattern.test(surname);
}

