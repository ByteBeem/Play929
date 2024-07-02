import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Modal from "../CodeModal/modal";
import Modal2 from "../CodeModal/Modal2";
import { countries as countriesList } from "countries-list";
import { validateRequired, validateEmail, validatePassword, validateMatch, validateSurname } from "../Validation/Validation";
import "./Login.scss";

const Login = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [message, setMessage] = useState("");
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);
  const [Age, setAge] = useState(null);
  const [Dob, setDob] = useState(null);
  const [Gender, setGender] = useState("");
  
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);


  const validateemail = (email) => {
    const emailRegex = new RegExp(
      "^(?!\\.)[a-zA-Z0-9._%+-]+@(?!-)[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    );
    return emailRegex.test(email);
  }
  

  useEffect(() => {
        setIsButtonDisabled(
          errorMessage ||
            !formData.email ||
            !formData.password
        );
    }, [errorMessage, formData.email ,formData.password]);



  const [signUpFormData, setSignUpFormData] = useState({
    full: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "ZA",
    ID : "",
    terms:false,
  });

  const [section, setSection] = useState(1);
  const [errorSignUpMessage, setErrorSignUpMessage] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const countryOptions = Object.entries(countriesList)
      .map(([code, country]) => ({
        code,
        name: country.name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    setCountries(countryOptions);
  }, []);


  const validatePassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      return "Passwords do not match";
    } else if (
      password.length < 6 ||
      !/[0-9]/.test(password) ||
      !/[a-zA-Z]/.test(password)
    ) {
      return "Password must be at least 6 characters long and contain both letters and numbers";
    }
    return "";
  };

  const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    return nameRegex.test(name);
  };


  const validateID = (ID) => {
    const idRegex = /^[0-9]{13}$/;
    return idRegex.test(ID);
  };
  
  const CalcSumOfString = (valueToSum) => {
    var lengthOfString = valueToSum.length;
    var sumOfString = 0;
    for (var i = 0; i < lengthOfString; i++) {
      sumOfString += parseInt(valueToSum.substr(i, 1));
    }
    return sumOfString;
  };
  
  const SAIDCheck = (IdNumber, setErrors) => {
    var d1 = 0;
    var d2 = 0;
    var d3 = 0;
    var d4 = 0;
    var d5 = 0;
    var d6 = 0;
    var d7 = 0;
    var d8 = 0;
    var d9 = 0;
    var d10 = 0;
    var d11 = 0;
    var d12 = 0;
    var d13 = 0;
    var evsum = 0;
    var odsum = 0;
    var evnum1 = 0;
    var evnum2 = 0;
    var evnum3 = 0;
    var evnum4 = 0;
    var evnum5 = 0;
    var evnum6 = 0;
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
        result.error =
          "Invalid ID Number - does not match the required format.";
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
      if (parseInt(yy) <= moment().format("YY")) {
        cc = "20";
      }
      const ccyy = cc + yy;
      const mm = id.substring(2, 4);
      const dd = id.substring(4, 6);
      const dob = ccyy + "-" + mm + "-" + dd;
      result.dob = new Date(moment(dob, "YYYY-MM-DD"));
      result.age = moment().diff(dob, "years");
  
      if (isNaN(result.age)) {
        result.error = "Invalid ID Number - gender could not be determined";
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
          result.error =
            "Invalid ID Number - citizenship could not be determined";
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
  
      result.isValid = SAIDCheck(num);
  
      return result;
    },
  };
  
  

  const handleChangeSignUp = (e) => {
    const { name, value } = e.target;
    setSignUpFormData((prevState) => ({ ...prevState, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleBack = () => {
    setErrorSignUpMessage("");
    setSection((prevSection) => prevSection - 1);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const closeModal2 = () => {
    setIsModal2Open(false);
  };

  const handleNext = () => {
    setErrors({
      full: "",
      surname: "",
      email: "",
      ID: "",
      password: "",
      confirmPassword: "",
      country: "",
    });

    if (section === 1) {
      if (!validateName(signUpFormData.full)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          full: "Invalid full name. Use letters and spaces only",
        }));
        return;
      }
      if (!validateName(signUpFormData.surname)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          surname: "Invalid surname. Use letters and spaces only",
        }));
        return;
      }
      if (!validateemail(signUpFormData.email)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Invalid email ",
        }));
        return;
      }
    }
    if (section === 2) {
      if (signUpFormData.country === "ZA") {
        const validationResult = idValidationService.checkNumber(signUpFormData.ID);
        localStorage.setItem("email", signUpFormData.email);
        console.log(signUpFormData.email);
        if (
          !validateID(signUpFormData.ID) ||
          !idValidationService.checkNumber(signUpFormData.ID) ||
          !SAIDCheck(signUpFormData.ID)
        ) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            ID: "Invalid ID number",
          }));
          return;
        }

        if (validationResult.age < 18) {
          setGender(validationResult.gender);
          console.log(validationResult.gender);
          setAge(validationResult.age);
          setDob(validationResult.dob);
          setErrors((prevErrors) => ({
            ...prevErrors,
            ID: " Sorry,You are Under age of 18.",
          }));
          return;
        }
        if (validationResult.citizenship !== "SA Citizen") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            ID: " Sorry,You must be an SA Citizen.",
          }));
          return;
        }
      }
    }

    
    setSection((prevSection) => prevSection + 1);
  };

  const handleSubmitSignUp = async (e) => {
    setErrorSignUpMessage("");
    e.preventDefault();
    const { full, surname, country, email, password  , confirmPassword , ID , terms} = signUpFormData;

    if (!validateEmail(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email",
      }));
      return;
    }



    if(!terms){

      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Please agree to terms & conditions."
      }))
      return;

    }
    

    if(!validatePassword(password)){
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "password must have more than 8 characters."
      }))
      return;
    }

    if(confirmPassword != password){
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Password do not match."
      }))
      return;
    }

    setIsLoading(true);
    localStorage.setItem("email", email);

    try {
      const response = await axios.post("https://play929-1e88617fc658.herokuapp.com/auth/signup", {
        full,
        surname,
        country,
        email,
        password,
      });

      if (response.status === 200) {
        setShowSignUp(false);
        setShowForgotPassword(false);
        setFormData({ email: "", password: "" });
        setSignUpFormData({
          full: "",
          surname: "",
          email: "",
          password: "",
          confirmPassword: "",
          country: "ZA",
        });
        setIsLoading(false);
        setErrorMessage("");
        setSection(1);
        setErrorMessage("");
        setIsLoading(false);
        setErrorMessage("");
        setErrorMessage("");
        setIsResetLoading(false);
        setIsModalOpen(true);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorSignUpMessage(error.response.data.error);
        
        setIsLoading(false);
       
      } else {
        setErrorSignUpMessage("Signup failed. Please try again.");
        
        setIsLoading(false);
    
      }
      setIsLoading(false);
      
    }
  };

  const handleChange = (e) => {
    setErrorMessage("");
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    setErrorMessage("");
    e.preventDefault();
    const { email, password } = formData;


    if (!validateRequired(email)) {

      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is Required",
      }));
      return;

    }

    if (!validateRequired(password)) {

      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Password is Required",
      }));
      return;

    }

    if (!validateEmail(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email",
      }));
      return;
    };


    setIsLoading(true);

    try {
      const response = await axios.post("https://play929-1e88617fc658.herokuapp.com/auth/login", {
        email,
        password,
       
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        window.location.href = "https://play929.vercel.app";
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
       
      } else {
        setErrorMessage("Login failed. Please try again.");
      
      }
    }

    setIsLoading(false);
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
  };

  const handleSignUpClick = () => {
    setShowSignUp(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setShowSignUp(false);
    setFormData({ email: "", password: "" });
    setSignUpFormData({
      full: "",
      surname: "",
      email: "",
      password: "",
      confirmPassword: "",
      country: "ZA",
    });
    setErrorMessage("");
    setSection(1);
    setIsLoading(false);
    setIsResetLoading(false);
    setMessage("");
  };

  const handleChangeForgotPassword = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmitReset = async (e) => {
    setMessage("");
    e.preventDefault();

    const { email } = formData;
    if (!email || !email.trim() || !validateEmail(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

   
    localStorage.setItem("ResetEmail", email);
    setIsResetLoading(true);

    try {
      const response = await axios.post("https://play929-1e88617fc658.herokuapp.com/auth/resetPassword", {
        email,
        
      });

      if (response.status === 200) {
        setIsModal2Open(true);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setMessage(error.response.data.error);
        
      } else {
        setMessage("Failed to reset password. Please try again later.");
       
      }
    }

    setIsResetLoading(false);
  };

 

  return (
    isOpen && (
      <div className={`error-modal-overlay ${showForgotPassword ? "forgot-password-mode" : ""}`}>
        <div className={`login ${showForgotPassword ? "forgot-password-mode" : ""}`}>
          <div className="login_container">
            <button className="login-close-button" onClick={onClose}>
              X
            </button>
            {!showForgotPassword && !showSignUp ? (
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={errors.email ? "error-input" : "valid-input"}
                  />
                  {errors.email && <p className="error-message">{errors.email}</p>}
                </div>
                <label htmlFor="password">Password</label>
                <div className="password-input-container">
                  <input
                    type= "text" 
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={errors.password ? "error-input" : "valid-input"}
                  />
                  
                </div>
                {errors.password && <p className="error-message">{errors.password}</p>}
                
                <button
                  type="submit"
                  className={`form_btn ${isLoading ? "disabled" : ""}`}
                  disabled={isLoading || isButtonDisabled}
                  aria-busy={isLoading}
                >
                  {isLoading ? "Logging In..." : "Log In"}
                </button>
                {isLoading && <div className="loading-spinner" />}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
              </form>
            ) : showForgotPassword ? (
              <div className="forgot-password-form">
                <h2>Reset Your Password</h2>
                <div className="forgot-password-container">
                  <form onSubmit={handleSubmitReset}>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChangeForgotPassword}
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className={`form_btn ${isResetLoading ? "disabled" : ""}`}
                      disabled={isResetLoading}
                      aria-busy={isResetLoading}
                    >
                      {isResetLoading ? "Resetting..." : "Reset"}
                    </button>
                  </form>
                  {message && <p className="message">{message}</p>}
                </div>
                <button onClick={handleBackToLogin}>Back to Login</button>
              </div>
            ) : (
              <div className="form">
                <form onSubmit={handleSubmitSignUp}>
                  {section === 1 && (
                    <>
                      <div className="input-group">
                        <label htmlFor="full">Full Name(s): </label>
                        <input
                          type="text"
                          id="full"
                          name="full"
                          value={signUpFormData.full}
                          onChange={handleChangeSignUp}
                          required
                        />
                        {errors.full && <p className="error-message">{errors.full}</p>}
                      </div>
                      <div className="input-group">
                        <label htmlFor="surname">Surname: </label>
                        <input
                          type="text"
                          id="surname"
                          name="surname"
                          value={signUpFormData.surname}
                          onChange={handleChangeSignUp}
                          required
                        />
                        {errors.surname && <p className="error-message">{errors.surname}</p>}
                      </div>
                      <div className="input-group">
                        <label htmlFor="email">Email: </label>
                        <input
                          type="text"
                          id="email"
                          name="email"
                          value={signUpFormData.email}
                          onChange={handleChangeSignUp}
                          required
                        />
                        {errors.email && <p className="error-message">{errors.email}</p>}
                      </div>
                    </>
                  )}

                  {section === 2 && (
                    <>
                      <div className="input-group">
                        <label htmlFor="country">Country: </label>
                        <select
                          id="country"
                          className="dropdown"
                          name="country"
                          value={signUpFormData.country}
                          onChange={handleChangeSignUp}
                          required
                        >
                          {countries.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                        <div className="input-group">
                        <label htmlFor="email">ID number: </label>
                        <input
                          type="numeric"
                          id="ID"
                          name="ID"
                          value={signUpFormData.ID}
                          onChange={handleChangeSignUp}
                          required
                        />
                        {errors.email && <p className="error-message">{errors.email}</p>}
                      </div>

                        {errors.country && <p className="error-message">{errors.country}</p>}
                      </div>
                    </>
                  )}

                  {section === 3 && (
                    <>
                      <div className="input-group">
                        <label htmlFor="password">Password: </label>
                        <input
                          type="text"
                          id="password"
                          name="password"
                          value={signUpFormData.password}
                          onChange={handleChangeSignUp}
                          required
                        />
                       
                        {errors.password && <p className="error-message">{errors.password}</p>}
                      </div>
                      <div className="input-group">
                        <label htmlFor="confirmPassword">Confirm Password: </label>
                        <input
                          type="text"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={signUpFormData.confirmPassword}
                          onChange={handleChangeSignUp}
                          required
                        />
                      
                      {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                      </div>
                      <div>
                      <label htmlFor="agreeToTerms">
                        <input
                          type="checkbox"
                          id="agreeToTerms"
                          name="agreeToTerms"
                          checked={signUpFormData.terms}
                          onChange={handleChangeSignUp}
                          required
                        />
                        I agree to the terms and conditions
                      </label>
                      {errors.agreeToTerms && (
                        <p className="error-message">{errors.agreeToTerms}</p>
                      )}
                    </div>
                    </>
                  )}



                  <div className="navigation-buttons">
                    {section > 1 && (
                      <button type="button" onClick={handleBack}>
                        Back
                      </button>
                    )}
                    {section < 3 && (
                      <button type="button" onClick={handleNext}>
                        Next
                      </button>
                    )}
                    {section === 3 && (
                      <button type="submit" className="form_btn" disabled={isLoading}>
                        {isLoading ? "Registering..." : "Register"}
                      </button>
                    )}
                  </div>
                  {isLoading && <div className="loading-spinner" />}
                  {errorSignUpMessage && <p className="error-message">{errorSignUpMessage}</p>}
                </form>
              </div>
            )}
            {!showForgotPassword && (
              <div className="bottom">
                <span>
                  Don't have an account?{" "}
                  <Link className="link" to="#" onClick={handleSignUpClick}>
                    Signup
                  </Link>
                </span>
                <span>
                  Forgot Password?{" "}
                  <Link className="reset_btn" to="#" onClick={handleForgotPasswordClick}>
                    Reset
                  </Link>
                </span>
              </div>
            )}
          </div>
          <Modal isOpen={isModalOpen} onClose={closeModal} />
          <Modal2 isOpen={isModal2Open} onClose={closeModal2} />
        </div>
      </div>
    )
  );
};

export default Login;
