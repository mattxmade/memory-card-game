import { nanoid } from "nanoid";
import React, { Suspense, useEffect, useRef, useState } from "react";

import {
  Html,
  Plane,
  OrbitControls,
  Sky,
  Scroll,
  useScroll,
  Stats,
  ScrollControls,
  Billboard,
  Text,
  Text3D,
  Float,
  Center,
  useGLTF,
} from "@react-three/drei";

import { Flex, Box, useFlexSize } from "@react-three/flex";
import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";

import Card from "./THREE/Card";
import GameAssets from "./THREE/PlayCard";
import InterBold from "./THREE/fonts/Inter_Bold.json";
import elipse from "../images/elipse.svg";
import degreesToRadian from "./THREE/utility/degressToRadian";
import psIcon from "../components/ps_home_a.svg";
import { TextureLoader } from "three";

import allAssetsFromDirectory from "./THREE/Assets";

const PsxMemo = (props) => {
  // const ref = useRef();
  // useFrame((state, delta) => (ref.current.rotation.x += 0.01));

  return (
    <Card
      position={props.position}
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
  console.count("Card render");

  const NewCard = GameAssets.GameCard;

  const { card, clr, scale, rotation, selected, shuffle, materials } = props;
  return (
    <NewCard
      card={card.uri}
      materials={materials}
      cardRef={card}
      clr={clr}
      scale={scale}
      rotation={rotation}
      selected={selected}
      request={shuffle}
    />
  );
};

const FiveCardSuite = ({
  cardSet,
  requestReshuffle,
  selected,
  assets,
  materials,
}) => {
  console.count("Row render");
  let cardIndex = 0;

  return (
    <Box flexDir={"row"} justify="center" wrap={"wrap"}>
      {cardSet.map((card, index) => {
        const clr = cardIndex === 0 ? "black" : "white";

        cardIndex++;

        return (
          <Box key={nanoid()} centerAnchor={false} margin={0.05}>
            <Float floatIntensity={0}>
              <PsxCard
                card={card}
                materials={materials[card.deckIndex]}
                clr={clr}
                scale={[0.1, 0.1, 0.1]}
                rotation={[180, 0, 0]}
                selected={selected}
                shuffle={requestReshuffle}
              />
            </Float>
          </Box>
        );
      })}
    </Box>
  );
};

const breakpoints = {
  small: 1.653704375753992,
  medium: 2.388048332566217,
  large: 3.847596754008787,
};

let rowNum = 1;

const totalNumberOfCards = [...new Array(50).fill(0)].map(
  (item, index) => (item = index)
);

const GameView = (props) => {
  console.count("Game view render");

  const [score, setScore] = useState(0);

  const fullCirlce = 2 * Math.PI;
  const scoreDecrement = (2 * Math.PI) / (numOfRows * 5);

  const [numOfRows, setNumOfRows] = useState(1); // each level is a row of 5 cards
  const [cards, setCards] = useState(newCardSet(numOfRows, totalNumberOfCards));

  const [requestNewCards, setRequestNewCards] = useState(false);
  const [requestReshuffle, setRequestReshuffle] = useState(false);
  const [requestNextLevel, setRequestNextLevel] = useState(false);

  const [selected, setSelected] = useState();
  const [noRepeat, setNoRepeat] = useState();
  const [trackSelected, setTrackSelected] = useState([]);
  const [remainingCards, setRemainingCards] = useState(fullCirlce);

  useEffect(() => {
    // console.log(score);
  }, [score]);

  // level increase + 1 new row of cars
  useEffect(() => {
    if (requestNextLevel) {
      setNumOfRows(numOfRows + 1);

      setRequestNewCards(true);
      setRequestNextLevel(false);
      rowNum++;

      setNoRepeat();
      setRemainingCards(fullCirlce);
    }
  }, [requestNextLevel]);

  // new cards, same number of rows (level unchanged)
  useEffect(() => {
    if (requestNewCards) {
      setCards(newCardSet(numOfRows, totalNumberOfCards));
      setRequestNewCards(false);
      setNoRepeat();
      setRemainingCards(fullCirlce);
    }
  }, [requestNewCards]);

  // reshuffle cards
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

  // track selected card
  useEffect(() => {
    if (selected) {
      if (trackSelected.includes(selected)) {
        //console.log("You Lose...");

        setSelected();
        setTrackSelected([]);
        return setRequestNewCards(true);
      }

      //console.log("Great work, keep it up!");
      setTrackSelected(trackSelected.concat(selected));
      setNoRepeat(true);
      setSelected();
    }
  }, [selected]);

  // game won
  useEffect(() => {
    if (trackSelected.length === cards.length) {
      //console.log("You Win!");

      setTrackSelected([]);
      setRequestNextLevel(true);
    }
  }, [trackSelected]);

  // score piechart
  useEffect(() => {
    if (noRepeat) {
      setRemainingCards(remainingCards - scoreDecrement);
      setNoRepeat(false);
    }
  }, [noRepeat]);

  // max level beaten - declare winner

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
          assets={props.assets}
          materials={props.materials}
          cardSet={fiveCardSet}
          selected={setSelected}
          requestReshuffle={setRequestReshuffle}
        />
      );
    }
  });
};

const Layout = (props) => {
  //console.count("Layout render");

  // const data = useScroll();

  // const singlePage = data.pages / 4;
  // //console.log(singlePage);

  // data.el.className = "scroll-box";
  // //console.dir(data);

  // useFrame(() => {
  //   // data.offset = 0.331;
  //   // console.log(data.offset);
  //   //const a = data.range(0, 1 / 3);
  //   // console.log(a);
  // });

  const group = useRef();
  const { size, viewport } = useThree();
  const vpWidth = -viewport.width / 2 + 0.32;

  const headerHeight = 0.331;
  const rowHeight = 0.331;
  const largeDisplay = headerHeight + rowNum * rowHeight;

  // page     : .331 === 1 card row
  // distance : 0.1  === 1 card row

  // code something up for smaller viewports
  const pages = rowNum < 3 && window.innerWidth >= 1152 ? 1 : largeDisplay;
  const distance = rowNum < 3 && window.innerWidth >= 1152 ? 0 : rowNum * 0.01;

  const [pageBreakpoint, setPageBreakpoint] = useState(0);
  const [distBreakpoint, setDistBreakpoint] = useState(0);

  useEffect(() => {
    //console.log("change");

    // 5 card split over 2 rows
    if (viewport.width <= 3.847596754008787) {
      setPageBreakpoint(rowNum * 0.331 * 2 + headerHeight);
    }
    // 5 card split over 3 rows
    if (viewport.width <= 2.388048332566217) {
      setPageBreakpoint(rowNum * 0.329 * 3 + headerHeight);
    }
    // 5 cards split over 5 rows
    if (viewport.width <= 1.653704375753992) {
      setPageBreakpoint(rowNum * 0.329 * 5 + headerHeight);
    }

    // large viewport
    if (viewport.width > 3.847596754008787) {
      setPageBreakpoint(pages);
    }
  }, [viewport.width]);

  // vpWidth begin less than -1.4 means vp is getting wider
  const contentAlign =
    vpWidth < -1.4481063609166982 && rowNum < 3 ? "flex-end" : "flex-start";

  return (
    <group ref={group}>
      <ScrollControls
        pages={pageBreakpoint === 0 ? pages : pageBreakpoint} // Each page takes 100% of the height of the canvas
        distance={distance + distBreakpoint} // scroll bar travel (default: 1)
        damping={3} // Friction, higher is faster (default: 4)
        horizontal={false} // Can also scroll horizontally (default: false)
        infinite={false} // Can also scroll infinitely (default: false)
      >
        <Scroll>
          <PsxMemo
            position={[0, 2, -2]}
            color={"grey"}
            invert={false}
            scale={[0.3, 0.3, 0.3]}
            rotate={true}
          />
          <Flex
            // padding={0.1}
            flexDirection="column"
            justify={contentAlign}
            alignItems="center"
            alignContent={contentAlign}
            size={[viewport.width, viewport.height, 0]}
            position={[
              -viewport.width / 2 + 0.3,
              viewport.height / 2 - 0.36 - 0,
              0,
            ]}
          >
            {/* <Box flexDir="row" justify="center" align="center">
              <Box margin={0.1} centerAnchor={false}>
                <PsxMemo
                  position={[0.275, 0.25, -2]}
                  color={"grey"}
                  invert={false}
                  scale={[0.3, 0.3, 0.3]}
                  rotate={true}
                />
              </Box>
            </Box> */}
            <GameView assets={props.assets} materials={props.materials} />
          </Flex>
        </Scroll>
      </ScrollControls>
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

const App = () => {
  //console.count("App render");

  // top load materials - pass down to component === less renders
  const assets = allAssetsFromDirectory("models");
  const materialGroup = assets.map((asset) => {
    const { materials } = useGLTF(asset.uri);

    return materials;
  });

  const colorMap = useLoader(TextureLoader, psIcon);

  const body = document.body;
  body.style.cursor = `url(${elipse}), pointer`;

  const orientateGrid = degreesToRadian([90, 0, 0]);
  const orientateAxis = degreesToRadian(-90);

  return (
    <>
      <div id="canvas-container">
        <Canvas
          shadows
          frameloop="demand"
          dpr={window.devicePixelRatio}
          camera={{
            // orthographic: true,
            position: [0, 0, 1.95],
          }}
        >
          <Stats />
          {/* <OrbitControls
          // enableZoom={false}
          // enableRotate={false}
          // enablePan={false}
          // minPolarAngle={Math.PI / 2}
          // maxPolarAngle={Math.PI / 2}
          /> */}
          <color attach="background" args={["lightgrey"]} />
          <directionalLight
            args={[0xffffff]} //0xff0000
            color="whitesmoke"
            position={[-2, 0, 150]}
            intensity={0.5}
          />
          <ambientLight intensity={0.5} />
          <spotLight
            position={[1, 10, 25]}
            // position={[10, 10, 25]}
            penumbra={1}
            angle={0.2}
            color="white"
            castShadow
            intensity={1}
            shadow-mapSize={[512, 512]}
          />
          <directionalLight
            position={[0, -15, -0]}
            intensity={4}
            color="steelblue"
          />
          <Suspense fallback={<Html center>loading..</Html>}>
            <Layout
              assets={assets}
              materials={materialGroup}
              // cards={cards}
              // setCards={setCards}
              // level={numOfRows}
              // noRepeat={setNoRepeat}
              // requestNewCards={setRequestNewCards}
              // requestNextLevel={setRequestNextLevel}
              // notifyScore={setScore}
            />
          </Suspense>
          <GridBox
            orientateGrid={orientateGrid}
            orientateAxis={orientateAxis}
          />
        </Canvas>
      </div>
      {/* <div
        style={{
          backgroundColor: "#cecdcd",
          width: "100vw",
          height: "28px",
          position: "absolute",
          bottom: 0,
          left: 0,
          // outline: "1px dashed red",
        }}
      ></div> */}
    </>
  );
};

const GridBox = ({ rotation, orientateGrid, orientateAxis }) => (
  <group rotation={[0, 0, 0]} position={[0, 0, -9]}>
    <gridHelper // back wall
      position={[0, 2.5, -7.5]}
      rotation={orientateGrid}
      scale={[1.5, 3, 1]}
    />

    <Plane
      scale={[12, 15, 1]}
      receiveShadow
      position={[-7.5, 3.5, 2]}
      rotation={degreesToRadian([45, 90, 90])}
    >
      <meshPhongMaterial attach="material" color="#ffffff" />
    </Plane>

    <gridHelper // left wall
      position={[-7.5, 2.5, 0]}
      rotation={degreesToRadian([90, 0, 90])}
      scale={[1.5, 3, 1]}
    />

    <gridHelper // right wall
      position={[7.5, 2.5, 0]}
      rotation={degreesToRadian([90, 0, 90])}
      scale={[1.5, 3, 1]}
    />

    <Plane
      scale={[12, 15, 1]}
      receiveShadow
      position={[0, -2.5, 1.5]}
      rotation={[orientateAxis, 0, 0]}
    >
      <meshPhongMaterial attach="material" color="#ffffff" />
    </Plane>

    <gridHelper
      position={[0, -2.5, 0]}
      rotation={[0, 0, 0]}
      scale={(1.5, 1.5, 1.5)}
    />
  </group>
);

export default App;
