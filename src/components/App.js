import React, { Fragment, Suspense, useEffect, useRef, useState } from "react";
import Game from "./Game";
import Sounds from "./Sounds";

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
    closeModal.addEventListener("click", () => {
      modal.close();
      document.querySelector(".sfx-close").play();
    });
    setGameReady(true);
  }, []);

  useEffect(() => {
    if (gameReady) setTimeout(initGame, 500);
  }, [gameReady]);

  return (
    <Fragment>
      <Game />
      <Sounds />
    </Fragment>
  );
};

export default App;
