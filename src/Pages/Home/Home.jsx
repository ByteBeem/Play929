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
      userEmail: "",
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
      const response = await axios.get('https://play929-1e88617fc658.herokuapp.com/users/old', {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });

      if (response.status === 200) {
        this.setState({ prevGames: response.data.prevGames });
        this.state.prevGames.forEach(game => {
          

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
      const response = await axios.get('https://play929-1e88617fc658.herokuapp.com/users/email', {
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
  };

  handleWatch = async()=>{

    console.log("watching...");

  };

  render() {
    const { showSidebar, active, closeSidebar } = this.props;
    const {  maxContainerHeight, errorModalOpen, errorMessage, prevGames } = this.state;
    

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
                          <h3>{game.game}</h3>
                          <p>{game.stakeAmount} {game.mode}</p>

                          {game.state === "won" ? (
                            <p style={{ color: "green" }}></p>
                          ) : (
                            <p style={{ color: "green" }}>{game.state}</p>
                          )}

                          <button className="watch-button" onClick={this.handleWatch} >Watch</button>

                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-games-message">
                      <p>No games found. Start creating now and play!</p>
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
