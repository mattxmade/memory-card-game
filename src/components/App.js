import React, { Fragment, Suspense, useEffect, useRef, useState } from "react";
import svgCircleButton from "../svg/circle-button.svg";
import Game from "./Game";

const App = () => {
  const modal = document.querySelector("dialog");

  const closeModal = document.querySelector(".close-modal");
  const loadScreen = document.querySelector(".loading-screen");

  const body = document.body;
  body.style.cursor = `url(${svgCircleButton}), pointer`;

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
