import React, { Component } from "react";
import axios from "axios";
import "./Deposit.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

class Deposit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: "",
      csrfToken: "",
      loading: false,
      message: "",
      error: "",
      currentBalance: "0.00",
      show: true,
    };

    this.countryCode = localStorage.getItem("country");
    this.token = localStorage.getItem("token");
    this.idClient = localStorage.getItem("idclient");
  }

  handleDeposit = () => {
    this.setState({ error: "", message: "", loading: true });

    if (!this.token) {
      this.setState({
        error: "Token not found, please log in again.",
        loading: false,
      });
      return;
    }

    const { amount } = this.state;

    if (isNaN(amount) || amount <= 0) {
      this.setState({ error: "Invalid amount", loading: false });
      return;
    }

    if (amount < 10) {
      this.setState({ error: "Minimum amount is R10", loading: false });
      return;
    }

    if (amount > 1000) {
      this.setState({ error: "Maximum amount is R1000", loading: false });
      return;
    }

    const requestBody = {
      amount: parseFloat(amount),
    };

    axios
      .post(
        "https://play929-1e88617fc658.herokuapp.com/wallet/deposit",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      )
      .then((response) => {
        this.setState({ message: `Redirecting...` });

        window.location.href = response.data.url;
        this.setState({ amount: "" });
      })
      .catch((error) => {
        this.setState({ error: "Deposit failed. " + error.response.data.error });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  render() {
    const { amount, message, error } = this.state;
    const { showSidebar, active, closeSidebar } = this.props;

    return (
      <div className="deposit">
        <Sidebar active={active} closeSidebar={closeSidebar} />
        <div className="deposit_container">
          <Navbar showSidebar={showSidebar} />
          <div className="content">
            <div className="middle">
              <div className="deposit_form">
                {this.countryCode === "ZA" ? (
                  <>
                    <h2>
                      <b>Payfast Method :</b>{" "}
                    </h2>
                    <div>
                      <label>Deposit Amount</label>
                      <br />
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => this.setState({ amount: e.target.value })}
                        inputMode="numeric"
                      />

                      {message && <p className="success-message">{message}</p>}
                      {error && <p className="error-message">{error}</p>}
                    </div>
                    <button
                      className="form_btn"
                      onClick={this.handleDeposit}
                      disabled={this.state.loading}
                    >
                      {this.state.loading ? "Processing..." : "Make Payment"}
                    </button>
                  </>
                ) : (
                  <PayPalScriptProvider options={{ "client-id": "Aed5UEDwLFdwNKeX05avjbYGjEqvPqpOVfLPgvmk_4jM7rVkgtubq2IatkHNaM4aLVLYAuykpr9xQlg6" }}>
                    <div className="deposit_form">
                      <h1>Deposit with PayPal</h1>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => this.setState({ amount: e.target.value })}
                        inputMode="numeric"
                      />
                      <PayPalButtons
                        style={{ layout: 'vertical' }}
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            purchase_units: [{
                              amount: {
                                value: amount,
                              },
                            }],
                          });
                        }}
                        onApprove={(data, actions) => {
                          return actions.order.capture().then(details => {
                            alert('Transaction completed by ' + details.payer.name.given_name);
                          });
                        }}
                      />
                    </div>
                  </PayPalScriptProvider>
                )}
              </div>

              <div className="footer">
                <p>Deposits are processed securely and swiftly using trusted payment gateways like PayFast and Yoco.</p>
                <p>We do not store any of your banking information. Your financial details are handled directly by our secure payment partners.</p>
                <p>Your privacy and security are our top priorities. We adhere to strict data protection regulations and industry-standard security measures to safeguard your information.</p>
                <p>For any inquiries or assistance, please contact our customer support team at <span className="contact-email">support@play929.com</span>.</p>
                <p>© 2024 Play929. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Deposit;
