import React, { Component } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Error from "../ErrorModal/ErrorModal";
import "./Home.scss";
import word from "../../assets/word.jpg";
import chess from "../../assets/chess.png";
import shootout from "../../assets/shootout.jpg";
import cup from "../../assets/cup.jpg";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: "",
      errorModalOpen: false,
      prevGames: [
        { name: 'Chess', image: chess, minimum: 'R10' },
        { name: 'Word Search', image: word, minimum: 'R10' },
        { name: 'Cup Guess', image: cup, minimum: 'R10' },
        { name: 'Penalty Shootout', image: shootout, minimum: 'R10' },
      ],
      loading: false,
      betAmountInput: "",
      userEmail: "",
      maxContainerHeight: window.innerHeight - 100,
      isSidebarOpen: false
    };

    this.token = localStorage.getItem('token');
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.fetchUserEmail();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({ maxContainerHeight: window.innerHeight - 100 });
  }

  fetchUserEmail = async () => {
    if (!this.token) {
      return;
    }
    this.setState({ loading: true });

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
        this.setState({ userEmail, loading: false });
      }
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  handlePlay = (gameName) => {
    console.log(`Playing ${gameName}...`);
  };

  toggleSidebar = () => {
    this.setState((prevState) => ({
      isSidebarOpen: !prevState.isSidebarOpen
    }));
  };

  render() {
    const { showSidebar, active, closeSidebar } = this.props;
    const { maxContainerHeight, errorModalOpen, errorMessage, prevGames, loading } = this.state;
    const { isSidebarOpen } = this.state;

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
                        <img src={game.image} alt={`${game.name} image`} />
                        <div className="tournament_info">
                          <h3>{game.name}</h3>
                          <p>Minimum: {game.minimum}</p>
                          <button className="play-button" onClick={() => this.handlePlay(game.name)}>Play</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    this.token && loading && (
                      <div className="no-games-message">
                        <p>Loading...</p>
                      </div>
                    )
                  )}
                  {!this.token && !loading &&
                    <div className="no-games-message">
                      <p>No games found, Please Login.</p>
                    </div>
                  }
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
