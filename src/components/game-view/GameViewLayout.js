import {
  Html,
  PresentationControls,
  ScrollControls,
  Scroll,
  useScroll,
} from "@react-three/drei";

import { Flex } from "@react-three/flex";
import { invalidate, useFrame, useThree } from "@react-three/fiber";
import React, { Fragment, useEffect, useRef, useState } from "react";

import degreesToRadian from "./utility/degressToRadian";
import flexDisplayHandler from "./utility/flexDisplayHandler";

import CardsView from "./CardsView";
import GameResult from "./GameResult";
import Scoreboard from "../Scoreboard";
import NavControls from "../NavControls";

const ScrollNavigationUI = (props) => {
  const { scrollUp, scrollDown, setScrollUp, setScrollDown, scrollFactor } =
    props;

  const data = useScroll();
  data.el.classList.add("scroll-box");

  useFrame(() => {
    if (scrollUp) {
      setScrollDown(false);
      data.el.scrollBy(0, -window.innerHeight);
      setTimeout(() => setScrollUp(false), 2800);
    }

    if (scrollDown) {
      setScrollUp(false);
      data.el.scrollBy(0, window.innerHeight);
      setTimeout(() => setScrollDown(false), 2800);
    }
  });
};

const GameViewLayout = ({ materials }) => {
  //console.count("Layout render");

  const group = useRef();
  const { size, viewport } = useThree();

  const width = size.width;
  const height = size.height;

  // level | number of rows (5 cards per row | 50 card total | 10 levels)
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);

  const [toggleView, setToggleView] = useState("");
  const [gameResult, setGameResult] = useState({ message: "", style: "white" });

  /*
  ScrollControls
    page increment  : .329 | scale height of single card with margin
    scroll distance : 0.1  | scroll travel distance for 1 card row
  */

  const cardHeight = 0.329;
  const [scrollUp, setScrollUp] = useState(false);
  const [scrollDown, setScrollDown] = useState(false);

  const cardsLayout = flexDisplayHandler(width, height, cardHeight, level);
  const { pageBreakpoint, distBreakpoint, contentAlign, wrapNum } = cardsLayout;

  const offsetForSmallViewports = size.width <= 640 ? 0.075 : 0;

  const flexProps = {
    paddingTop: 0.1,
    flexDir: "column",
    justify: contentAlign,
    alignItems: "center",
    alignContent: contentAlign,
    size: [viewport.width, viewport.height, 0],
  };

  const flexGameViewPosition = [
    -viewport.width / 2 + 0.32 + offsetForSmallViewports,
    viewport.height / 2 - 0.2,
    0,
  ];

  const [presRotation, setPresRotation] = useState(
    degreesToRadian([-12, 0, 0])
  );

  const HtmlProps = {
    position: [-viewport.width / 2, viewport.height / 2],
    style: { zIndex: 1000 },
  };

  useEffect(() => {
    if (toggleView === "change-view-angle") {
      setPresRotation(degreesToRadian([-45, 0, 0]));
    }
    if (toggleView === "reset-view-angle") {
      setPresRotation(degreesToRadian([-12, 0, 0]));
    }

    if (toggleView !== "") setToggleView("");
  }, [toggleView]);

  const rotateView = (rotation, timer) => {
    setTimeout(() => {
      setPresRotation(rotation);
    }, timer);
  };

  useFrame((state, delta, xrFrame) => {
    if (gameResult.message !== "") {
      invalidate();

      rotateView(degreesToRadian([-40, 0, 0]), 600, false);
      rotateView(degreesToRadian([-12, 0, 0]), 3000, true);

      setTimeout(() => setGameResult({ message: "", style: "white" }), 3600);
    }
  });

  return (
    <Fragment>
      <group ref={group} name="game-view">
        <ScrollControls
          pages={pageBreakpoint} // Combined height of rows
          distance={distBreakpoint} // scroll bar travel (default: 1)
          damping={3} // Friction, higher is faster (default: 4)
          horizontal={false}
          infinite={false}
        >
          <ScrollNavigationUI
            scrollFactor={wrapNum * level}
            scrollUp={scrollUp}
            scrollDown={scrollDown}
            setScrollUp={setScrollUp}
            setScrollDown={setScrollDown}
          />
          <PresentationControls
            global={false}
            cursor={true}
            snap={false} // snap back to default position
            speed={1}
            zoom={1}
            rotation={presRotation} // Default rotation
            polar={[-Math.PI / 6, 0]} // Vertical limits
            azimuth={[0, 0]} // Horizontal limits
            config={{ mass: 2, tension: 500, friction: 26 }} // Spring config
          >
            <Scroll>
              <Flex {...flexProps} position={flexGameViewPosition}>
                <CardsView
                  materials={materials}
                  score={score}
                  level={level}
                  setScore={setScore}
                  setLevel={setLevel}
                  setGameResult={setGameResult}
                />
              </Flex>

              <GameResult gameResult={gameResult} />
            </Scroll>
          </PresentationControls>
        </ScrollControls>
      </group>

      <Html as="aside" {...HtmlProps}>
        <Scoreboard level={level} score={score} />
        <NavControls
          setToggleView={setToggleView}
          setScrollUp={setScrollUp}
          setScrollDown={setScrollDown}
        />
      </Html>
    </Fragment>
  );
};

export default GameViewLayout;
