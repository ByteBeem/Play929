import React, { useState , useEffect} from "react";
import Error from "../ErrorModal/ErrorModal";
import Auth from "../Login/Auth";
import axios from "axios";
import "./create.scss";

const Create = ({ isOpen, onClose  , selectedGame}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [selectedGameType, setSelectedGameType] = useState('');
  const [selectedGameMode, setSelectedGameMode] = useState('');
  const [selectedNumberOfPlayers, setSelectedNumberOfPlayers] = useState('');
  const [selectedStakeAmount, setSelectedStakeAmount] = useState('');
  const gameTypes = ['', 'Tournament', 'One v/s One'];
  const gameModes = ['', 'Friendly', 'Stake Money'];
  const playerOptions = ['', 3, 4, 6, 8];
  const stakeAmountOptions = ['', 'R10', 'R30', 'R50', 'R100', 'R250'];
  const token = localStorage.getItem("token");
  const [players, setPlayers] = useState([]);
  const [isUnavailable , seIsUnavailable] = useState(true);
  const [csrfToken, setCsrfToken] = useState("");

  

  useEffect(() => {
    axios
      .get("https://play929-1e88617fc658.herokuapp.com/games/csrfToken", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        const csrfToken = response.data.csrfToken;
        
        setCsrfToken(csrfToken);
      });
  }, [token]);

  const handleSearch = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get("https://play929-1e88617fc658.herokuapp.com/games/Onlineplayers", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.status === 200) {
        setPlayers(response.data.players);
      }

    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
        setErrorModalOpen(true);
      } else {
        setErrorMessage("An error occurred while fetching data.");
        setErrorModalOpen(true);
      }
    } finally {
      setIsLoading(false);

    }
  };

  const createOnevsOne = async () => {
    setIsLoading(true);
    try {
      let payload = {};
      if (selectedGameType === "One v/s One" && selectedGameMode === "Friendly") {
        payload = {
          mode: "Friendly",
          type: selectedGameType,
          game:selectedGame,
        };
      } else if (
        selectedGameType === "One v/s One" &&
        selectedGameMode === "Stake Money"
      ) {
        payload = {
          mode: "Stake Money",
          stake: selectedStakeAmount,
          type: selectedGameType,
          game:selectedGame,
        };
      }

      const response = await axios.post(
        "https://play929-1e88617fc658.herokuapp.com/games/one-vs-one",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-CSRF-Token": csrfToken
          },
        }
      );

      if (response.status === 200) {
      
        window.location.href=response.data.Link;
      }
    } catch (error) {
      setErrorMessage(error.response.data.error);
      setErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };
  const createTournament = async () => {
    setIsLoading(true);
    try {
      let payload = {};
      if (selectedGameType === 'Tournament' && selectedGameMode === 'Friendly') {

        payload = {
          mode: selectedGameMode,
          numberOfPlayers: selectedNumberOfPlayers,
          type: selectedGameType,
          game:selectedGame,

        };
      } else if (selectedGameType === 'Tournament' && selectedGameMode === 'Stake Money') {

        payload = {
          mode: selectedGameMode,
          numberOfPlayers: selectedNumberOfPlayers,
          stakeAmount: selectedStakeAmount,
          type: selectedGameType,
          game:selectedGame,

        };
      }

      const response = await axios.post("https://play929-1e88617fc658.herokuapp.com/games/tournament", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  }



  const handleGameTypeChange = (e) => {
    setSelectedGameType(e.target.value);
    setSelectedNumberOfPlayers('');
    setSelectedStakeAmount('');
  };

  const handleGameModeChange = (e) => {
    setSelectedGameMode(e.target.value);
    setSelectedStakeAmount('');
  };

  const handleNumberOfPlayersChange = (e) => {
    setSelectedNumberOfPlayers(e.target.value);
  };

  const handleStakeAmountChange = (e) => {
    setSelectedStakeAmount(e.target.value);
  };

  const calculatePrize = () => {
    if (
      selectedGameType === 'Tournament' &&
      selectedGameMode !== 'Friendly' &&
      selectedNumberOfPlayers &&
      selectedStakeAmount
    ) {
      return selectedNumberOfPlayers * parseInt(selectedStakeAmount.slice(1), 10);
    }
    return 0;
  };

  return (
    isOpen && (
      <div className="create-modal-overlay">
        <div className="login">
          <div className="login_container">
            <button className="create-close-button" onClick={onClose}>
              X
            </button>
            
            {!selectedGameType && (
              <div>
                <span>Select Game Type:</span>
                <select
                  id="country"
                  className="dropdown"
                  name="country"
                  required
                  onChange={handleGameTypeChange}
                >
                  {gameTypes.map((gameType, index) => (
                    <option key={index} value={gameType}>
                      {gameType}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {selectedGameType && !selectedGameMode && (
              <div>
                <span>Select Game Mode:</span>
                <select
                  id="gameMode"
                  className="dropdown"
                  name="gameMode"
                  required
                  onChange={handleGameModeChange}
                >
                  {gameModes.map((gameMode, index) => (
                    <option key={index} value={gameMode}>
                      {gameMode}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {selectedGameMode && selectedGameType === 'Tournament' && (
              <div>
                <span>Select Number of Players:</span>
                <select
                  id="numberOfPlayers"
                  className="dropdown"
                  name="numberOfPlayers"
                  required
                  onChange={handleNumberOfPlayersChange}
                >
                  {playerOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {(selectedGameMode && selectedGameMode !== 'Friendly' && selectedGameType === 'Tournament') ||
              (selectedGameMode && selectedGameMode !== 'Friendly' && selectedGameType === 'One v/s One') ? (
              <div>
                <span>Select Stake Amount:</span>
                <select
                  id="stakeAmount"
                  className="dropdown"
                  name="stakeAmount"
                  required
                  onChange={handleStakeAmountChange}
                >
                  {stakeAmountOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            {selectedGameType && selectedGameMode && (
              <div>
                {selectedGameType === 'Tournament' && (
                  <p>Number of Players: {selectedNumberOfPlayers}</p>
                )}
                {selectedGameMode !== 'Friendly' && selectedGameType === 'Tournament' && (
                  <p>Prize: {calculatePrize()}</p>
                )}
              </div>
            )}
            {!selectedGameType && players &&(
              <div className="bottom">
                <span className="or_text">OR:</span>
                <button
                  onClick={handleSearch}
                  className={`form_btn ${isUnavailable ? "disabled" : ""}`}
                  disabled={isUnavailable}
                  aria-busy={isUnavailable}
                >
                  {isUnavailable ? "Search For Online Players ..." : "Search For Online Players"}
                </button>
              </div>
            )}
            {players && !selectedGameType && (
              <div className="online-players">
                {players.map((player, index) => (
                  <div key={index} className="player">

                    <h4><span>{player}</span></h4>
                    <button className="challenge-button">Challenge</button>
                  </div>
                ))}
              </div>
            )}

            {selectedGameType === 'One v/s One' && selectedGameMode === 'Friendly' && (
              <button
                onClick={createOnevsOne}
                className={`form_btn ${isLoading ? "disabled" : ""}`}
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? "Creating ..." : "Create game"}
              </button>
            )}


            {selectedGameType === 'One v/s One' && selectedGameMode === 'Stake Money' && selectedStakeAmount && (
              <button
                onClick={createOnevsOne}
                className={`form_btn ${isLoading ? "disabled" : ""}`}
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? "Creating ..." : "Create game"}
              </button>
            )}

            {selectedGameType === 'Tournament' && selectedGameMode === 'Friendly' && selectedNumberOfPlayers && (
              <button
                onClick={createTournament}
                className={`form_btn ${isLoading ? "disabled" : ""}`}
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? "Creating ..." : "Create tournament"}
              </button>
            )}

            {selectedGameType === 'Tournament' && selectedGameMode === 'Stake Money' && selectedStakeAmount && selectedNumberOfPlayers && (
              <button
                onClick={createTournament}
                className={`form_btn ${isLoading ? "disabled" : ""}`}
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? "Creating ..." : "Create tournament"}
              </button>
            )}

          </div>
        </div>

        {loginModalOpen && <Auth isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />}
        {errorModalOpen && <Error errorMessage={errorMessage} isOpen={errorModalOpen} onClose={() => setErrorModalOpen(false)} />}
      </div>
    )
  );
}

export default Create;
