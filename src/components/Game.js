import React, { Fragment, Suspense } from "react";

import { TextureLoader } from "three";
import { Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";

import degreesToRadian from "./game-view/utility/degressToRadian";
import allAssetsFromDirectory from "./game-view/assets/AssetsImporter";

import Stage from "./game-view/Stage";
import Lighting from "./game-view/Lighting";
import GameViewLayout from "./game-view/GameViewLayout";

const Game = () => {
  //console.count("render")

  const GridBoxA = Stage.gridBoxA;
  const GridBoxB = Stage.gridBoxB;

  const assets = allAssetsFromDirectory("webp");

  const textures = assets.map((asset) => {
    const texture = useLoader(TextureLoader, asset.uri);
    texture.flipY = false;

    return texture;
  });

  const orientateGrid = degreesToRadian([90, 0, 0]);
  const orientateAxis = degreesToRadian(-90);

  const canvasProps = {
    shadows: true,
    frameloop: "demand",
    dpr: window.devicePixelRatio,
    camera: { position: [0, 0, 1.95] },
  };

  return (
    <Fragment>
      <div id="canvas-container">
        <Canvas {...canvasProps}>
          <Lighting />
          <Suspense>
            <GameViewLayout materials={textures} />
          </Suspense>

          <GridBoxA
            rotation={[0, 1, 0]}
            orientateGrid={orientateGrid}
            orientateAxis={orientateAxis}
          />
          {/* <Stats/> */}
        </Canvas>
      </div>
    </Fragment>
  );
};

export default Game;
