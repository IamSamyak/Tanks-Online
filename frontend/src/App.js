import React, { useState } from "react";
import Home from "./pages/Home";
import Game from "./components/Game";

const App = () => {
  const [gameData, setGameData] = useState(null);

  return (
    <div>
      {gameData ? <Game gameCode={gameData.gameCode} twoPlayerId={gameData.playerId} /> : <Home setGameData={setGameData} />}
    </div>
  );
};

export default App;
