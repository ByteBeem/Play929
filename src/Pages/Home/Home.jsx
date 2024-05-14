import React, { Component } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Error from "../ErrorModal/ErrorModal";
import "./Home.scss";
import image from "../../assets/logo.jpg";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: "",
      errorModalOpen: false,
      prevGames: [], 
      loading: false,
      betAmountInput: "",
      userEmail : "",
      numberOfCards: 10,
      maxContainerHeight: window.innerHeight - 100
    };

    this.token = localStorage.getItem('token');
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.fetchPrevGames(); 
    this.fetchUserEmail();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({ maxContainerHeight: window.innerHeight - 100 });
  }

  fetchPrevGames = async () => {
    if (!this.token) {
      return;
    }

    try {
      const response = await axios.get('http://localhost:3001/users/old', {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });
   
        if (response.status === 200) {
          this.setState({ prevGames: response.data.prevGames });
          this.state.prevGames.forEach(game => {
            console.log("Mode:", game.mode);
            console.log("Stake Amount:", game.stakeAmount);
            console.log("Type:", game.type);
            console.log("Creator:", game.creator);
            console.log("Black Player Link:", game.blackPlayerLink);
            console.log("White Player Link:", game.whitePlayerLink);
          });
        }
        

    } catch (error) {
      
    }
  }

  fetchUserEmail = async () => {
    if (!this.token) {
      return;
    }
  
    try {
      const response = await axios.get('http://localhost:3001/users/email', {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });
  
      if (response.status === 200) {
        const userEmail = response.data.userEmail;
        console.log(userEmail);
        localStorage.setItem('userEmail', userEmail); 
        this.setState({ userEmail });
      }
    } catch (error) {
    
    }
  }

  render() {
    const { showSidebar, active, closeSidebar } = this.props;
    const { numberOfCards, maxContainerHeight, errorModalOpen, errorMessage, prevGames } = this.state;
    const hasToken = this.token;

    return (
      <div className="home">
        <Sidebar active={active} closeSidebar={closeSidebar} />
        <div className="home_container">
          <Navbar showSidebar={showSidebar} />
          <div className="content">
            <div className="games_slider">
              <div className="scrollview" style={{ maxHeight: maxContainerHeight }}>
                <div className="card_container">
                  {prevGames.length > 0 ? (
                    prevGames.map((game, index) => (
                      <div key={index} className="card">
                        <img src={image} alt={`Card ${index + 1}`} />
                        <div className="tournament_info">
                          <h3>{game.type}</h3>
                          <p>Type: {game.mode}</p>
                          <p style={{ color: game.state === "won" ? "green" : "red" }}>
                            State: {game.state}
                          </p>
                          {game.state === "won" ? (
                            <p style={{ color: "green" }}>You won!</p>
                          ) : (
                            <p style={{ color: "red" }}>You lost!</p>
                          )}
                          {/* Remove the condition to hide the join button */}
                          {/* {!hasToken || game.state === "won" ? null : (
                            <button className="join_button">Join</button>
                          )} */}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-games-message">
                      <p>No Previous games found. Start creating now and play!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {errorModalOpen && <Error errorMessage={errorMessage} isOpen={errorModalOpen} onClose={() => this.setState({ errorModalOpen: false })} />}
      </div>
    );
  }
}    
export default Home;
