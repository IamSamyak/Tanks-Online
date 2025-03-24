import React, { useState } from "react";
import Home from "./pages/Home";
import Game from "./components/Game";

const App = () => {
  const [gameCode, setGameCode] = useState(null);

  return (
    <div>
      {gameCode ? <Game gameCode={gameCode} /> : <Home setGameCode={setGameCode} />}
    </div>
  );
};

export default App;
