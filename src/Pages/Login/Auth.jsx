import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Modal from "../CodeModal/modal";
import Modal2 from "../CodeModal/Modal2";
import { countries as countriesList } from "countries-list";
import ReCAPTCHA from "react-google-recaptcha";
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
  const [recaptcha, setRecaptcha] = useState('');
  const recaptchaRef = useRef(null);

  const [signUpFormData, setSignUpFormData] = useState({
    full: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "ZA",
  });

  const [section, setSection] = useState(1);
  const [errorSignUpMessage, setErrorSignUpMessage] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const countryOptions = Object.entries(countriesList).map(([code, country]) => ({
      code,
      name: country.name,
    }));
    setCountries(countryOptions);
  }, []);

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
    setSection((prevSection) => prevSection + 1);
  };

  const handleSubmitSignUp = async (e) => {
    setErrorSignUpMessage("");
    e.preventDefault();
    const { full, surname, country, email, password } = signUpFormData;

    if (!validateEmail(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email",
      }));
      return;
    }

    if (!recaptcha) {
      setErrorSignUpMessage("Please verify you are not a robot.");
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
        setRecaptcha('');
        recaptchaRef.current.reset();
      } else {
        setErrorSignUpMessage("Signup failed. Please try again.");
        setRecaptcha('');
        recaptchaRef.current.reset();
      }
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    setErrorMessage("");
    e.preventDefault();
    const { email, password } = formData;



    if (!validateEmail(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email",
      }));
      return;
    }

    if (!recaptcha) {
      setErrorMessage("Please verify you are not a robot.");
      return;

    }

    setIsLoading(true);

    try {
      const response = await axios.post("https://play929-1e88617fc658.herokuapp.com/auth/login", {
        email,
        password,
        token: recaptcha,
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        window.location.href = "https://play929.vercel.app";
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
        setRecaptcha('');
        recaptchaRef.current.reset();
      } else {
        setErrorMessage("Login failed. Please try again.");
        setRecaptcha('');
        recaptchaRef.current.reset();
      }
    }

    setIsLoading(false);
  };

  const validateEmail = (email) => {
    const emailRegex = new RegExp(
      "^(?!\\.)[a-zA-Z0-9._%+-]+@(?!-)[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    );
    return emailRegex.test(email);
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
    if (!email || !email.trim()) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (!recaptcha) {
      setMessage("Please verify you are not a robot.");
      return;

    }
  localStorage.setItem("ResetEmail" , email);
    setIsResetLoading(true);

    try {
      const response = await axios.post("https://play929-1e88617fc658.herokuapp.com/auth/resetPassword", {
        email,
        token : recaptcha,
      });

      if (response.status === 200) {
        setIsModal2Open(true);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setMessage(error.response.data.error);
        setRecaptcha('');
        recaptchaRef.current.reset();
      } else {
        setMessage("Failed to reset password. Please try again later.");
        setRecaptcha('');
        recaptchaRef.current.reset();
      }
    }

    setIsResetLoading(false);
  };

  function onChange(value) {
    setRecaptcha(value);
    
  }

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
                <div>
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={errors.password ? "error-input" : "valid-input"}
                  />
                  {errors.password && <p className="error-message">{errors.password}</p>}
                </div>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="6LeZbckpAAAAAF29V1j_Rvg-4zv2SAbSuolJOKzp"
                  onChange={onChange}
                />
                <button
                  type="submit"
                  className={`form_btn ${isLoading ? "disabled" : ""}`}
                  disabled={isLoading}
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
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey="6LeZbckpAAAAAF29V1j_Rvg-4zv2SAbSuolJOKzp"
                      onChange={onChange}
                    />
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

                        {errors.country && <p className="error-message">{errors.country}</p>}
                      </div>
                    </>
                  )}

                  {section === 3 && (
                    <>
                      <div className="input-group">
                        <label htmlFor="password">Password: </label>
                        <input
                          type="password"
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
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={signUpFormData.confirmPassword}
                          onChange={handleChangeSignUp}
                          required
                        />
                        <ReCAPTCHA
                          sitekey="6LeZbckpAAAAAF29V1j_Rvg-4zv2SAbSuolJOKzp"
                          onChange={onChange}
                        />
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
