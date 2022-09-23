import { nanoid } from "nanoid";
import React, { Suspense, useEffect, useRef, useState } from "react";

import {
  Html,
  Plane,
  Scroll,
  Stats,
  Text3D,
  Float,
  Sky,
  useGLTF,
  useScroll,
  OrbitControls,
  ScrollControls,
  PresentationControls,
} from "@react-three/drei";

import { Flex, Box } from "@react-three/flex";
import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";

import Card from "./three-fiber-customs/Card";
import GameAssets from "./three-fiber-customs/PlayCard";
import InterBold from "./three-fiber-customs/fonts/Inter_Bold.json";
import elipse from "../images/elipse.svg";
import degreesToRadian from "./three-fiber-customs/utility/degressToRadian";
import psIcon from "../components/ps_home_a.svg";
import { TextureLoader } from "three";

import Stage from "./three-fiber-customs/Stage";
import Lighting from "./three-fiber-customs/Lighting";

import Game from "./Game";
import Scoreboard from "./Scoreboard";

import allAssetsFromDirectory from "./three-fiber-customs/Assets";

const PsxMemo = (props) => (
  <Card
    position={props.position}
    color={props.color}
    invert={props.invert}
    scale={props.scale}
    rotate={props.rotate}
  />
);

const colours = ["grey", "steelblue", "indianred", "purple"];

const materialProps = {
  thickness: 5,
  roughness: 0,
  clearcoat: 1,
  clearcoatRoughness: 0,
  transmission: 1,
  ior: 1.25,
  envMapIntensity: 25,
  color: "#ffffff",
  attenuationTint: "#ffe79e",
  attenuationDistance: 1,
};

const Sphere = (props) => {
  const colorMap = useLoader(TextureLoader, psIcon);

  return (
    <Float>
      <mesh position={props.position} rotation={props.rotation}>
        <sphereGeometry args={[0.1, 32, 16]} />
        <meshPhysicalMaterial
          wireframe={true}
          map={colorMap}
          {...materialProps}
        />
      </mesh>
    </Float>
  );
};

const PsxCard = (props) => {
  //console.count("Card render");

  const NewCard = GameAssets.GameCard;
  const { card, clr, scale, rotation, selected, materials } = props;

  return (
    <NewCard
      card={card}
      materials={materials}
      cardRef={card}
      clr={clr}
      scale={scale}
      rotation={rotation}
      selected={selected}
    />
  );
};

const FiveCardSuite = ({ cardSet, selected, materials }) => {
  //console.count("Row render");
  let cardIndex = 0;

  return (
    <Box flexDir={"row"} justify="center" wrap={"wrap"}>
      {cardSet.map((card, index) => {
        const clr = cardIndex === 0 ? "black" : "white";

        cardIndex++;

        return (
          <Box key={nanoid()} centerAnchor={false} margin={0.05}>
            {/* <Float floatIntensity={0}> */}
            <PsxCard
              card={card}
              materials={materials[card.deckIndex]}
              clr={clr}
              scale={[0.1, 0.1, 0.1]}
              rotation={[180, 0, 0]}
              selected={selected}
            />
            {/* </Float> */}
          </Box>
        );
      })}
    </Box>
  );
};

let rowNum = 10;

const totalNumberOfCards = [...new Array(50).fill(0)].map(
  (item, index) => (item = index)
);

// hooks

const GameView = (props) => {
  //console.count("Game view render");
  const { level, score, setLevel, setScore, setGameResult } = props;

  const newCardSet = Game.newCardSet;
  const shuffleIndexOrder = Game.shuffleIndexOrder;

  const numOfRows = level; // each level is a row of 5 cards
  const [cards, setCards] = useState(newCardSet(numOfRows, totalNumberOfCards));

  const [requestNewCards, setRequestNewCards] = useState(false);
  const [requestReshuffle, setRequestReshuffle] = useState(false);
  const [requestNextLevel, setRequestNextLevel] = useState(false);

  const [selected, setSelected] = useState();
  const [trackSelected, setTrackSelected] = useState([]);

  // feedback :: player selects card
  useEffect(() => {
    if (selected) {
      if (trackSelected.includes(selected)) {
        // restart game
        setSelected();
        setTrackSelected([]);

        setLevel(1);
        setScore(0);

        setGameResult({ message: "Try again...", style: "red" });

        setTimeout(() => {
          setRequestNewCards(true);
        }, 4200);

        return;
      }

      // continue play
      setTrackSelected(trackSelected.concat(selected));

      setScore(score + 1);
      setRequestReshuffle(true);

      setSelected();
    }
  }, [selected]);

  // reshuffle cards
  useEffect(() => {
    if (requestReshuffle) {
      setCards(() => {
        const indexShuffle = shuffleIndexOrder(cards, cards.length);
        return cards.map((card, index) => cards[indexShuffle[index]]);
      });

      setRequestReshuffle(false);
    }
  }, [requestReshuffle]);

  // new cards, same number of rows (level unchanged)
  useEffect(() => {
    if (requestNewCards) {
      setCards(newCardSet(numOfRows, totalNumberOfCards));
      setRequestNewCards(false);
    }
  }, [requestNewCards]);

  // level increase + 1 new row of cards
  useEffect(() => {
    if (requestNextLevel) {
      if (level < 10) {
        setLevel(level + 1);
        setRequestNewCards(true);
      }

      setScore(0);
      setRequestNextLevel(false);
    }
  }, [requestNextLevel]);

  // level completed / won the game
  useEffect(() => {
    if (trackSelected.length === cards.length) {
      // console.log("You Win!");

      setRequestNextLevel(true);
      setGameResult({ message: "Great memory!", style: "lightgrey" });

      setTrackSelected([]);
    }
  }, [trackSelected]);

  let set = 0;
  let fiveCardSet = [];

  return cards.map((card, index) => {
    if (set === 5) {
      set = 0;
      fiveCardSet = [];
    }

    fiveCardSet.push(card);
    set++;

    if (set === 5) {
      return (
        <FiveCardSuite
          key={nanoid()}
          indexPos={index}
          materials={props.materials}
          cardSet={fiveCardSet}
          selected={setSelected}
          // requestReshuffle={setRequestReshuffle}
        />
      );
    }
  });
};

const ScrollConfig = () => {
  const data = useScroll();
  data.el.classList.add("scroll-box");

  // useFrame(() => {
  //   if (upClick) {
  //     console.log("up clicked");
  //     upClick = false;
  //   }

  //   if (downClick) {
  //     console.log("down clicked");
  //     downClick = false;
  //   }
  // });
};

const flexDisplayHandler = (width, height, heightOffset, numberOfRows) => {
  /*
  Flex Breakpoints | Responsiveness

  Aspect Ratio
  Static    Dynamic
  w 100px   h   <  95px                     :: 1 row
  h 96px    w   >  100px                    :: 1 row

  w 100px   h   >= 96px   &&    <= 118px    :: 2 rows
  w 100px   h   >= 119px  &&    <= 159px    :: 3 rows
  w 100px   h   >= 238px  &&                :: 5 rows

  h 95px    w   <= 99px   &&    >= 60px     :: 2 rows
  h 95px    w   <= 59px   &&    >= 40px     :: 3 rows
  h 95px    w   <= 39px                     :: 5 rows
  */

  const percentage = width / 100;

  // single row
  let pageBreakpoint = 1;
  let distBreakpoint = 0;
  let contentAlign = "flex-end";

  // 5 cards, 1 flex row
  if (height <= percentage * 81) {
    //console.log("1 row");

    pageBreakpoint = 1;
    distBreakpoint = 0;
    contentAlign = "flex-end";

    if (numberOfRows > 2) contentAlign = "flex-start";

    if (numberOfRows > 3) {
      pageBreakpoint = numberOfRows * heightOffset;
      distBreakpoint = numberOfRows * 0.1;
    }
  }

  // 5 cards, wrapped over 2 flex rows
  if (height > percentage * 81 && height <= percentage * 136) {
    //console.log("2 rows");

    pageBreakpoint = 1;
    distBreakpoint = 0;
    contentAlign = "flex-end";

    if (numberOfRows > 1) {
      pageBreakpoint = numberOfRows * heightOffset * 2;
      distBreakpoint = numberOfRows * 0.1;
      contentAlign = "flex-start";
    }
  }

  // 5 cards, wrapped over 3 flex rows
  if (height >= percentage * 137 && height <= percentage * 204) {
    //console.log("3 rows");

    pageBreakpoint = 1;
    distBreakpoint = 0;

    if (numberOfRows > 1) {
      pageBreakpoint = numberOfRows * heightOffset * 3;
      distBreakpoint = numberOfRows * 0.1;
    }

    contentAlign = "flex-start";
  }

  // 5 cards, wrapped over 5 flex rows
  if (height >= percentage * 205) {
    //console.log("5 rows");

    pageBreakpoint = numberOfRows * heightOffset * 5;
    distBreakpoint = numberOfRows * 0.1;
    contentAlign = "flex-start";
  }

  return { pageBreakpoint, distBreakpoint, contentAlign };
};

const Layout = ({ materials }) => {
  console.count("Layout render");

  /*
  ScrollControls
    page increment  : .329 | scale height of single card with margin
    scroll distance : 0.1  | scroll travel distance for 1 card row
  */

  const group = useRef();
  const { size, viewport } = useThree();

  // level | number of rows (5 cards per row | 50 card total | 10 levels)
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);

  const width = size.width;
  const height = size.height;

  const margin = true; // compensate for margin on card box
  const cardHeight = margin ? 0.329 : 0.295; // card scale height

  const cardsLayout = flexDisplayHandler(width, height, cardHeight, level);
  const { pageBreakpoint, distBreakpoint, contentAlign } = cardsLayout;

  let MobileGuiOffset = 0.125;
  const padBot = level < 2 && size.width >= 655 ? 0.25 : 0.1;

  const [gameResult, setGameResult] = useState({ message: "", style: "white" });

  const flexProps = {
    paddingTop: 0.1,
    //paddingBottom: padBot,
    // paddingBottom: 0.1,
    flexDir: "column",
    justify: contentAlign,
    alignItems: "center",
    alignContent: contentAlign,
    size: [viewport.width, viewport.height, 0],
  };

  const flexGameViewPosition = [
    -viewport.width / 2 + 0.32,
    viewport.height / 2 - 0.2,
    0,
  ];

  const flexScoreBoardPos = [
    -viewport.width / 2 + 0.1,
    viewport.height / 2 - 0.1,
    0,
  ];

  const [presRotation, setPresRotation] = useState(
    degreesToRadian([0, 0, 0])
    //degreesToRadian([0, 0, 0])
  );

  const rotateView = (rotation, timer) => {
    setTimeout(() => {
      setPresRotation(rotation);
    }, timer);
  };

  useEffect(() => {
    if (gameResult.message !== "") {
      rotateView(degreesToRadian([-40, 0, 0]), 600, false);
      rotateView(degreesToRadian([0, 0, 0]), 3000, true);

      setTimeout(() => setGameResult({ message: "", style: "white" }), 3100);
    }
  }, [gameResult]);

  return (
    <group ref={group} name="game-view">
      <ScrollControls
        pages={pageBreakpoint} // Combined height of rows
        distance={distBreakpoint} // scroll bar travel (default: 1)
        damping={3} // Friction, higher is faster (default: 4)
        horizontal={false}
        infinite={false}
      >
        <PresentationControls
          global={false}
          cursor={true}
          snap={false} // snap back to default position
          speed={1}
          zoom={1}
          //rotation={[0, 0, 0]}
          rotation={presRotation} // Default rotation
          polar={[-Math.PI / 6, 0]} // Vertical limits
          azimuth={[0, 0]} // Horizontal limits
          config={{ mass: 2, tension: 500, friction: 26 }} // Spring config
        >
          <ScrollConfig />
          <Scroll>
            {/* <PsxMemo
              position={[0, 0.75, -1]}
              color={"grey"}
              invert={false}
              scale={[0.25, 0.25, 0.25]}
              rotate={true}
            /> */}

            <Flex {...flexProps} position={flexGameViewPosition}>
              <GameView
                materials={materials}
                score={score}
                level={level}
                setScore={setScore}
                setLevel={setLevel}
                setGameResult={setGameResult}
              />
            </Flex>

            <Flex {...flexProps} position={flexScoreBoardPos}>
              <Box
                flexDir={"row"}
                justify="space-between"
                align={"flex-start"}
                width={"100%"}
                height={"100%"}
                flexGrow={1}
              >
                <Box centerAnchor={false} margin={0.05}>
                  {/* <Sphere /> */}
                </Box>

                <Box centerAnchor={false} margin={0.05}>
                  {() => {
                    const flexScale = viewport.width / 12;

                    return (
                      <Text3D
                        font={InterBold}
                        scale={[flexScale, flexScale, flexScale]}
                        position={[-0.11, 1, 0]}
                        rotation={degreesToRadian([70, 0, 0])}
                      >
                        {/* {score}/{level * 5} */}
                        {gameResult.message}
                        <meshPhysicalMaterial
                          materialProps
                          color={gameResult.style}
                        />
                      </Text3D>
                    );
                  }}
                </Box>

                <Box centerAnchor={false} margin={0.05}>
                  {/* <Sphere /> */}
                </Box>
              </Box>
            </Flex>
          </Scroll>
        </PresentationControls>
      </ScrollControls>

      <Html as="div" position={[-viewport.width / 2, viewport.height / 2]}>
        <Scoreboard level={level} score={score} />
      </Html>
    </group>
  );
};

const App = () => {
  const GridBoxA = Stage.gridBoxA;
  const GridBoxB = Stage.gridBoxB;

  // load materials - pass down to component | improved render performance
  const assets = allAssetsFromDirectory("models");
  const materialGroup = assets.map((asset) => {
    const { materials } = useGLTF(asset.uri);

    return materials;
  });

  //const colorMap = useLoader(TextureLoader, psIcon);

  const body = document.body;
  body.style.cursor = `url(${elipse}), pointer`;

  const orientateGrid = degreesToRadian([90, 0, 0]);
  const orientateAxis = degreesToRadian(-90);

  const canvasProps = {
    shadows: true,
    frameloop: "demand",
    dpr: window.devicePixelRatio,
    camera: { position: [0, 0, 1.95] },
  };

  return (
    <>
      {console.count("render")}
      <div id="canvas-container">
        <Canvas {...canvasProps}>
          {/* <Stats /> */}
          {/* <OrbitControls /> */}
          <Lighting />
          <Suspense fallback={<Html center>loading..</Html>}>
            {/* <PsxMemo
              color={"grey"}
              position={[0, 0.75, -2]}
              scale={[0.25, 0.25, 0.25]}
              rotate={true}
            /> */}
            <Layout materials={materialGroup} />
          </Suspense>

          <GridBoxB
            //rotation={[0, 0, 0]}
            rotation={[0, -1, 0]}
            orientateGrid={orientateGrid}
            orientateAxis={orientateAxis}
          />
        </Canvas>
      </div>
    </>
  );
};

export default App;
