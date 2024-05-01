import React, { Component } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Home.scss";
import image from "../../assets/logo.jpg";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      betAmountInput: "",
      numberOfCards: 10,
      maxContainerHeight: window.innerHeight - 100
    };

    this.token = localStorage.getItem('token');
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({ maxContainerHeight: window.innerHeight - 100 });
  }

  render() {
    const { showSidebar, active, closeSidebar } = this.props;
    const { loading, numberOfCards, maxContainerHeight } = this.state;
    const hasToken = this.token;

    const cards = Array.from({ length: numberOfCards }, (_, index) => index);

    return (
      <div className="home">
        <Sidebar active={active} closeSidebar={closeSidebar} />
        <div className="home_container">
          <Navbar showSidebar={showSidebar} />
          <div className="content">
            <div className="games_slider">
              <div className="scrollview" style={{ maxHeight: maxContainerHeight }}>
                <div className="card_container">
                  {cards.map((cardIndex) => (
                    <div key={cardIndex} className="card">
                      <img src={image} alt={`Card ${cardIndex + 1}`} />
                      <div className="tournament_info">
                        <h3>Tournament Name</h3>
                        <button 
                          className={`join_button ${hasToken ? "disabled" : ""}`}
                          disabled={hasToken} 
                          aria-busy={hasToken} 
                        >
                          Join
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;