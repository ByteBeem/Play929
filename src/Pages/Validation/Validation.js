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