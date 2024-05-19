export const validateRequired = (value) => {
    return value ? '' : 'This field is required.';
  };
  
 
  export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? '' : 'Invalid email address.';
  };
  
  export const validatePassword = (password) => {
    return password.length >= 8 ? '' : 'Password must be at least 8 characters long.';
  };
  
  
  export const validateMatch = (value1, value2) => {
    return value1 === value2 ? '' : 'Fields do not match.';
  };
 