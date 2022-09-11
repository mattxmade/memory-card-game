import { nanoid } from "nanoid";
import React, { Suspense, useEffect, useRef, useState } from "react";

import {
  Html,
  Plane,
  OrbitControls,
  Sky,
  Scroll,
  Stats,
  ScrollControls,
} from "@react-three/drei";

import { Flex, Box, useFlexSize } from "@react-three/flex";
import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";

import Card from "./THREE/Card";
import GameCard from "./THREE/PlayCard";
import elipse from "../images/elipse.svg";
import degreesToRadian from "./THREE/utility/degressToRadian";

const PsxMemo = (props) => {
  // const ref = useRef();
  // useFrame((state, delta) => (ref.current.rotation.x += 0.01));

  return (
    <Card
      color={props.color}
      invert={props.invert}
      scale={props.scale}
      rotate={props.rotate}
    />
  );
};

const MemoryCards = () => {
  return (
    <group>
      <Box margin={0.1} centerAnchor={false}>
        <PsxMemo color="steelblue" scale={[0.2, 0.2, 0.2]} rotate={true} />
      </Box>

      <Box margin={0.1} centerAnchor={false}>
        <PsxMemo color={"grey"} scale={[0.3, 0.3, 0.3]} rotate={true} />
      </Box>

      <Box margin={0.1} centerAnchor={false}>
        <PsxMemo color={"indianred"} scale={[0.2, 0.2, 0.2]} rotate={true} />
      </Box>

      <Box margin={0.1} centerAnchor={false}>
        <PsxMemo color={"purple"} scale={[0.2, 0.2, 0.2]} rotate={true} />
      </Box>
    </group>
  );
};

const PsxCard = (props) => {
  //console.count("Card render");

  const { card, clr, scale, rotate, rotation, selected, shuffle } = props;
  return (
    <GameCard
      cardRef={card}
      clr={clr}
      scale={scale}
      // rotate={true}
      // rotate={rotate}
      rotation={rotation}
      selected={selected}
      request={shuffle}
    />
  );
};

const FiveCardSuite = ({ cardSet, requestReshuffle, selected }) => {
  //console.count("Row render");

  let cardIndex = 0;

  return (
    <Box flexDir={"row"} justify="center" wrap={"wrap"}>
      {cardSet.map((card, index) => {
        const clr = cardIndex === 0 ? "black" : "white";
        cardIndex++;

        return (
          <Box key={nanoid()} centerAnchor={false} margin={0.05}>
            <PsxCard
              card={card}
              clr={clr}
              scale={[0.1, 0.1, 0.1]}
              rotation={[180, 0, 0]}
              selected={selected}
              shuffle={requestReshuffle}
            />
          </Box>
        );
      })}
    </Box>
  );
};

let rowNum = 1;

const breakpoints = {
  small: 1.653704375753992,
  medium: 2.388048332566217,
  large: 3.847596754008787,
};

// destructuring props in ()
const Layout = ({
  pageOffset,
  distOffset,
  requestNewCards,
  requestNextLevel,
  level,
  cards,
  setCards,
}) => {
  //console.count("Layout render");

  const group = useRef();
  const { size, viewport } = useThree();

  const vpWidth = -viewport.width / 2 + 0.32;
  // console.log(viewport.width);

  let breakpointPage = 0;
  let breakpointDistance = 0;

  // 5 card split over 2 rows
  if (viewport.width <= 3.847596754008787) {
    breakpointPage = level * 0.331 * 2;
    // breakpointDistance = level * 0.1;
  }
  // 5 card split over 3 rows
  if (viewport.width <= 2.388048332566217) {
    breakpointPage = level * 0.329 * 3;
    // breakpointDistance = level * 0.1 * 2;
  }
  // 5 cards split over 5 rows
  if (viewport.width <= 1.653704375753992) {
    breakpointPage = level * 0.329 * 5;
    // breakpointDistance = level * 0.1 * 4;
  }

  // props callback to app
  pageOffset(breakpointPage);
  distOffset(breakpointDistance);

  // vpWidth begin less than -1.4 means vp is getting wider
  const contentAlign =
    vpWidth < -1.4481063609166982 && level < 3 ? "center" : "flex-start";

  let set = 0;
  let fiveCardSet = [];

  const [requestReshuffle, setRequestReshuffle] = useState(false);

  useEffect(() => {
    if (requestReshuffle) {
      //console.log("request reshuffle");

      setCards(() => {
        const indexShuffle = shuffleIndexOrder(cards, cards.length);
        return cards.map((card, index) => cards[indexShuffle[index]]);
      });

      setRequestReshuffle(false);
    }
  }, [requestReshuffle]);

  const [selected, setSelected] = useState();
  const [trackSelected, setTrackSelected] = useState([]);

  useEffect(() => {
    if (selected) {
      if (trackSelected.includes(selected)) {
        //console.log("You Lose...");
        setSelected();
        setTrackSelected([]);
        return requestNewCards(true);
      }

      //console.log("Great work, keep it up!");
      setTrackSelected(trackSelected.concat(selected));
      setSelected();
    }
  }, [selected]);

  useEffect(() => {
    if (trackSelected.length === cards.length) {
      //console.log("You Win!");

      setTrackSelected([]);
      requestNextLevel(true);
    }
  }, [trackSelected]);

  //if (trackSelected.length) console.log(trackSelected);

  return (
    <group ref={group}>
      <Flex
        padding={0.1}
        flexDirection="column"
        justify={contentAlign}
        alignItems="center"
        alignContent={contentAlign}
        size={[viewport.width, viewport.height, 0]}
        position={[-viewport.width / 2 + 0.32, viewport.height / 2 - 0.36, 0]}
      >
        {/* <Box margin={0.1} centerAnchor={false}>
        <PsxMemo
          color={"grey"}
          invert={false}
          scale={[0.3, 0.3, 0.3]}
          rotate={true}
        />
      </Box> */}

        {cards.map((card, index) => {
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
                cardSet={fiveCardSet}
                selected={setSelected}
                requestReshuffle={setRequestReshuffle}
              />
            );
          }
        })}
      </Flex>
    </group>
  );
};

const shuffleIndexOrder = (array, stopper) => {
  const shuffledArray = [];
  let uniqueIndex = 0;

  const arrayIndexRandomiser = (array) => {
    return Math.floor(Math.random() * array.length);
  };

  while (uniqueIndex < stopper) {
    const newIndex = arrayIndexRandomiser(array);

    if (!shuffledArray.includes(newIndex)) {
      uniqueIndex++;
      shuffledArray.push(newIndex);
    }

    if (uniqueIndex === stopper) break;
  }

  return shuffledArray;
};

const newCardSet = (level, allCards) => {
  const gameObjects = [];
  const indexTracker = [];

  let uniqueIndex = 0;
  const totalNumOfCards = level * 5;

  while (gameObjects.length < totalNumOfCards) {
    const index = allCards[Math.floor(Math.random() * allCards.length)];

    if (!indexTracker.includes(index)) {
      const cardGameObject = {
        id: nanoid(),
        rowIndex: uniqueIndex,
        deckIndex: index,
      };

      uniqueIndex++;
      gameObjects.push(cardGameObject);

      indexTracker.push(index);
    }

    if (gameObjects.length === totalNumOfCards) break;
  }

  return gameObjects;
};

const App = (props) => {
  //console.count("App render");

  const totalNumberOfCards = [...new Array(50).fill(0)].map(
    (item, index) => (item = index)
  );

  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(10);

  const [cards, setCards] = useState(newCardSet(level, totalNumberOfCards));

  const body = document.body;
  body.style.cursor = `url(${elipse}), pointer`;

  const orientateGrid = degreesToRadian([90, 0, 0]);
  const orientateAxis = degreesToRadian(-90);

  // page     : .331 === 1 card row
  // distance : 0.1  === 1 card row

  // code something up for smaller viewports
  const pages = level <= 3 ? 1 : level * 0.331;
  const distance = level <= 3 ? 0 : level * 0.01;

  const [pageBreakpoint, setPageBreakpoint] = useState(0);
  const [distBreakpoint, setDistBreakpoint] = useState(0);

  const [requestNewCards, setRequestNewCards] = useState(false);
  const [requestNextLevel, setRequestNextLevel] = useState(false);

  useEffect(() => {
    // console.log(score);
  }, [score]);

  // new cards, same number of rows (level unchanged)
  useEffect(() => {
    if (requestNextLevel) {
      setLevel(level + 1);
      setRequestNewCards(true);
      setRequestNextLevel(false);
    }
  }, [requestNextLevel]);

  // new cards, same number of rows (level unchanged)
  useEffect(() => {
    if (requestNewCards) {
      setCards(newCardSet(level, totalNumberOfCards));
      setRequestNewCards(false);
    }
  }, [requestNewCards]);

  return (
    <>
      <div id="canvas-container">
        <Canvas
          // shadows
          frameloop="demand"
          dpr={window.devicePixelRatio}
          camera={{
            orthographic: true,
            position: [0, 0, 1.95],
          }}
        >
          <Stats />
          <OrbitControls />
          <color attach="background" args={["lightgrey"]} />
          <directionalLight
            args={[0xffffff]} //0xff0000
            color="whitesmoke"
            position={[-2, 0, 150]}
            intensity={0.5}
          />
          <ambientLight intensity={0.5} />
          <spotLight
            position={[20, 20, 25]}
            penumbra={1}
            angle={0.2}
            color="white"
            castShadow
            shadow-mapSize={[512, 512]}
          />
          <directionalLight
            position={[0, -15, -0]}
            intensity={4}
            color="steelblue"
          />

          <ScrollControls
            pages={pageBreakpoint === 0 ? pages : pageBreakpoint} // Each page takes 100% of the height of the canvas
            distance={distance + distBreakpoint} // scroll bar travel (default: 1)
            damping={3} // Friction, higher is faster (default: 4)
            horizontal={false} // Can also scroll horizontally (default: false)
            infinite={false} // Can also scroll infinitely (default: false)
          >
            <Scroll>
              <Suspense fallback={<Html center>loading..</Html>}>
                <Layout
                  cards={cards}
                  setCards={setCards}
                  level={level}
                  pageOffset={setPageBreakpoint}
                  distOffset={setDistBreakpoint}
                  requestNewCards={setRequestNewCards}
                  requestNextLevel={setRequestNextLevel}
                  notifyScore={setScore}
                />
              </Suspense>
            </Scroll>
          </ScrollControls>

          <gridHelper
            position={[0, 0, -7.5]}
            rotation={orientateGrid}
            scale={[1.5, 1.5, 1]}
          />
          <Plane
            scale={[15, 15, 1]}
            receiveShadow
            position={[0, -2.5, 0]}
            rotation={[orientateAxis, 0, 0]}
          >
            <meshPhongMaterial attach="material" color="#ffffff" />
          </Plane>
          <gridHelper
            position={[0, -2.5, 0]}
            rotation={[0, 0, 0]}
            scale={(1.5, 1.5, 1.5)}
          />
        </Canvas>
      </div>
    </>
  );
};

export default App;
