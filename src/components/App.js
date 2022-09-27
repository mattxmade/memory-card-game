import React, { Fragment, Suspense, useEffect, useRef, useState } from "react";
import Game from "./Game";

const App = () => {
  const modal = document.querySelector("dialog");

  const closeModal = document.querySelector(".close-modal");
  const loadScreen = document.querySelector(".loading-screen");

  const [gameReady, setGameReady] = useState(false);

  const initGame = () => {
    modal.showModal();
    loadScreen.remove();
  };

  useEffect(() => {
    closeModal.addEventListener("click", () => modal.close());
    setGameReady(true);
  }, []);

  useEffect(() => {
    if (gameReady) setTimeout(initGame, 500);
  }, [gameReady]);

  return (
    <Fragment>
      <Game />
    </Fragment>
  );
};

export default App;
