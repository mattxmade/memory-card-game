import React, {
  Fragment,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { nanoid } from "nanoid";

import { Flex, Box, useFlexSize } from "@react-three/flex";
import {
  useAspect,
  Html,
  Plane,
  OrbitControls,
  Sky,
  Scroll,
  Stats,
  useGLTF,
  ScrollControls,
} from "@react-three/drei";

import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { TextureLoader } from "three/src/loaders/TextureLoader";

import memoryCard from "./THREE/models/PS1MemoryCard_BLEND/MemoryCard.fbx";
import memoryCardColorMap from "./THREE/models/PS1MemoryCard_BLEND/MCard_C.jpg";
import memoryCardNormalMap from "./THREE/models/PS1MemoryCard_BLEND/MCard_N.jpg";
import memoryCardSpecularMap from "./THREE/models/PS1MemoryCard_BLEND/MCard_S.jpg";

import Card from "./THREE/Card";
import GameCard from "./THREE/PlayCard";
import degreesToRadian from "./THREE/utility/degressToRadian";

import elipse from "../images/elipse.svg";

import allAssetsFromDirectory from "./THREE/Assets";
//const textures = allAssetsFromDirectory("textures");

const models = allAssetsFromDirectory("models");

const CVState = () => {
  // const canvasState = useThree();
  // console.dir(canvasState);

  // const fbx = useThree((state) => state.scene.children[2]);
  // if (fbx) console.log(fbx);

  useFrame((state, delta, xrFrame) => {
    const fbx = state.scene.children[2];
    if (fbx) fbx.rotation.y -= delta;
  });
};

const MemoryCard = (props) => {
  const fbx = useLoader(FBXLoader, memoryCard);

  fbx.scale.set(0.25, 0.25, 0.25);
  fbx.rotation.set(1.57, 0, 0);

  return <primitive object={fbx} />;
};

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
  return (
    <GameCard
      // altTexture={props.gameTex}
      texture={props.texture}
      scale={props.scale}
      // rotate={props.rotate}
      // rotate={true}
      rotation={props.rotation}
      clr={props.clr}
      beginGame={props.beginGame}
    />
  );
};

const FiveCardSuite = ({ maps, level, shuf, sendRequest }) => {
  // console.dir(maps[0]);
  // console.dir(shuf[0]);

  let cardIndex = 0;

  const [play, setPlay] = useState(false);
  const [gameTextures, setGameTextures] = useState(maps);
  const [altTextures, setAltTextures] = useState(shuf);

  useEffect(() => {
    if (play) {
      console.log("request");
      //sendRequest("randomise game cards");

      setGameTextures(shuf);
      setAltTextures(maps);
      setPlay(!play);
    }
  }, [play]);

  return (
    <Box flexDir={"row"} justify="center" wrap={"wrap"}>
      {[...new Array(5)].map((item, index) => {
        const clr = cardIndex === 0 ? "black" : "white";
        cardIndex++;

        return (
          <Box key={nanoid()} centerAnchor={false} margin={0.05}>
            <PsxCard
              gameTex={altTextures[index]}
              texture={gameTextures[index]}
              scale={[0.1, 0.1, 0.1]}
              rotation={[180, 0, 0]}
              clr={clr}
              beginGame={setPlay}
            />
          </Box>
        );
      })}
    </Box>
  );
};

let rowNum = 1;

// destructuring props in ()
const Layout = ({ pageOffset, distOffset, maps, shuf, sendRequest, texs }) => {
  const group = useRef();
  const { size, viewport } = useThree();

  const vpWidth = -viewport.width / 2 + 0.32;
  // console.log(viewport.width);

  let breakpointPage = 0;
  let breakpointDistance = 0;

  // 5 card split over 2 rows
  if (viewport.width <= 3.847596754008787) {
    breakpointPage = rowNum * 0.331 * 2;
    // breakpointDistance = rowNum * 0.1;
  }
  // 5 card split over 3 rows
  if (viewport.width <= 2.388048332566217) {
    breakpointPage = rowNum * 0.329 * 3;
    // breakpointDistance = rowNum * 0.1 * 2;
  }
  // 5 cards split over 5 rows
  if (viewport.width <= 1.653704375753992) {
    breakpointPage = rowNum * 0.329 * 5;
    // breakpointDistance = rowNum * 0.1 * 4;
  }

  // props callback to app
  pageOffset(breakpointPage);
  distOffset(breakpointDistance);

  // vpWidth begin less than -1.4 means vp is getting wider
  const contentAlign =
    vpWidth < -1.4481063609166982 && rowNum < 3 ? "center" : "flex-start";

  console.log(texs);

  return (
    <group ref={group}>
      <Flex
        padding={0.1}
        flexDirection="column"
        // flexWrap="wrap"
        justify={contentAlign}
        alignItems="center"
        alignContent={contentAlign}
        size={[viewport.width, viewport.height, 0]}
        position={[-viewport.width / 2 + 0.32, viewport.height / 2 - 0.36, 0]}
      >
        {/* <HeightReporter onReflow={onReflow} /> */}
        {/* <Box margin={0.1} centerAnchor={false}>
        <PsxMemo
          color={"grey"}
          invert={false}
          scale={[0.3, 0.3, 0.3]}
          rotate={true}
        />
      </Box> */}

        {[...new Array(rowNum)].map((item, index) => (
          <FiveCardSuite
            key={nanoid()}
            maps={maps[index]}
            shuf={shuf[index]}
            level={maps.length * 5}
            sendRequest={sendRequest}
          />
        ))}
      </Flex>
    </group>
  );
};

//mesh basic material colou | "#082444"

const shuffleIndexOrder = (arrayOfTextures) => {
  const shuffledArray = [];
  let uniqueIndex = 0;

  const arrayIndexRandomiser = (array) => {
    return Math.floor(Math.random() * array.length);
  };

  while (uniqueIndex < 5) {
    const newIndex = arrayIndexRandomiser(arrayOfTextures);

    if (!shuffledArray.includes(newIndex)) {
      uniqueIndex++;
      shuffledArray.push(newIndex);
    }

    if (uniqueIndex === 5) break;
  }
  return shuffledArray;
};

const App = (props) => {
  const body = document.body;
  body.style.cursor = `url(${elipse}), pointer`;

  const orientateGrid = degreesToRadian([90, 0, 0]);
  const orientateAxis = degreesToRadian(-90);

  // page     : .331 === 1 card row
  // distance : 0.1  === 1 card row

  const pages = rowNum <= 3 ? 1 : rowNum * 0.331;
  const distance = rowNum <= 3 ? 0 : rowNum * 0.01;

  const [pageBreakpoint, setPageBreakpoint] = useState(0);
  const [distBreakpoint, setDistBreakpoint] = useState(0);

  const modelTextures = models.map((model) => {
    const name = model.name;

    const { materials } = useGLTF(model.uri);
    return { materials, name };
  });

  const [textureMaps, setTextureMaps] = useState(() => {
    let increment = 0;
    let array = [];
    const finArray = [];

    for (let i = 0; i <= rowNum * 5; i++) {
      const index =
        modelTextures[Math.floor(Math.random() * modelTextures.length)];

      const textureObject = {
        index: i,
        id: index.materials[Object.keys(index.materials)[1]].uuid,
        map: index.materials[Object.keys(index.materials)[1]],
      };

      array.push(textureObject);
      increment++;

      if (increment === 5) {
        finArray.push(array);
        array = [];
        increment = 0;
      }
    }
    return finArray;
  });

  // get two sets - firstOrder / then randomise position of firstOrder
  let total = 0;

  const textureMapsShuffled = textureMaps.map((sets, index) => {
    total += sets.length;

    const shuffleArray = shuffleIndexOrder(sets);
    return sets.map((texture, index) => sets[shuffleArray[index]]);
  });

  //console.log(total);
  //console.table(textureMaps.flat());
  //console.table(textureMapsShuffled.flat());

  const [score, setScore] = useState(0);
  const [order, setOrder] = useState(textureMaps);

  const [request, setRequest] = useState("");

  useEffect(() => {
    if (request === "randomise game cards") {
      console.log(request);

      // setOrder(() =>
      //   textureMaps.map((sets, index) => {
      //     total += sets.length;

      //     const shuffleArray = shuffleIndexOrder(sets);
      //     return sets.map((texture, index) => sets[shuffleArray[index]]);
      //   })
      // );
    }

    setRequest("");
  }, [request]);

  // console.log(pages, distance);

  useEffect(() => {
    //console.log(pageBreakpoint, distBreakpoint);
  }, [pageBreakpoint, distBreakpoint]);

  // loop
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
          {/* <Sky /> */}
          <color attach="background" args={["lightgrey"]} />
          {/* <fog attach="fog" args={["lightgrey", 0, 26]} /> */}
          {/* <CVState /> */}
          {/* <OrbitControls autoRotate /> */}
          <OrbitControls />
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
            // pages={1.325}
            // distance={0.1}
            // pages={rowNum <= 3 ? 1 : 1.325} // Each page takes 100% of the height of the canvas
            // distance={rowNum <= 3 ? 0 : 0.1} // A factor that increases scroll bar travel (default: 1)
            pages={pageBreakpoint === 0 ? pages : pageBreakpoint}
            distance={distance + distBreakpoint}
            damping={3} // Friction, higher is faster (default: 4)
            horizontal={false} // Can also scroll horizontally (default: false)
            infinite={false} // Can also scroll infinitely (default: false)
          >
            <Scroll>
              <Suspense fallback={<Html center>loading..</Html>}>
                <Layout
                  pageOffset={setPageBreakpoint}
                  distOffset={setDistBreakpoint}
                  maps={textureMaps}
                  shuf={textureMapsShuffled}
                  sendRequest={setRequest}
                  texs={modelTextures}
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
