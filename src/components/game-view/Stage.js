import React from "react";
import { Plane } from "@react-three/drei";
import degreesToRadian from "./utility/degressToRadian";

import SVG from "./SVG";
import logo from "../../svg/logo.svg";

const Structure = (props) => (
  <mesh position={props.position}>
    <boxGeometry args={[1, 1, 15]} />
    <meshPhysicalMaterial attach="material" color={props.color} />
  </mesh>
);

const Wall = ({ scale, position, rotation, color }) => (
  <mesh position={position} rotation={rotation}>
    <boxGeometry args={scale} receiveShadow />
    <meshPhysicalMaterial attach="material" color={color} />
  </mesh>
);

const Stage = (() => {
  const gridBoxA = ({ rotation, orientateGrid, orientateAxis }) => (
    <group rotation={rotation} position={[0, 0, -9]}>
      <gridHelper // back wall
        position={[0, 2.5, -7.5]}
        rotation={orientateGrid}
        scale={[1.5, 3, 1]}
      />

      <Wall // right
        color="white"
        scale={[15, 8, 0.5]}
        position={[7.5, 2.5, 0]}
        rotation={degreesToRadian([90, -90, 90])}
      />

      <Plane // ground
        scale={[15, 15, 1]}
        receiveShadow
        position={[0, -2.5, 0]}
        rotation={[orientateAxis, 0, 0]}
      >
        <meshPhongMaterial attach="material" color="white" />
      </Plane>

      <gridHelper
        position={[0, -2.5, 0]}
        rotation={[0, 0, 0]}
        scale={(1.5, 1.5, 1.5)}
      />

      <SVG
        url={logo}
        scale={0.01}
        position={[1.4, 5.5, -16.5]}
        rotation={[0, -0.55, 0]}
        wireframe={true}
      />

      <Structure position={[7.5, 7, 0]} color={"white"} />
      <Structure position={[7.5, -2, 0]} color={"lightgrey"} />
    </group>
  );

  const gridBoxB = ({ rotation, orientateGrid, orientateAxis }) => (
    <group rotation={rotation} position={[0, 0, -9]}>
      <gridHelper // back wall
        position={[0, 2.5, -7.5]}
        rotation={orientateGrid}
        scale={[1.5, 3, 1]}
      />
      <Plane
        receiveShadow
        scale={[15, 10, 1]}
        position={[0, 2.5, -7.6]}
        rotation={degreesToRadian([180, 180, 0])}
      >
        <meshPhongMaterial attach="material" color="lightgrey" />
      </Plane>

      <Plane // ground
        scale={[12, 15, 1]}
        receiveShadow
        position={[0, -2.5, 1.5]}
        rotation={[orientateAxis, 0, 0]}
      >
        <meshPhongMaterial attach="material" color="white" />
      </Plane>

      <gridHelper
        position={[0, -2.5, 0]}
        rotation={[0, 0, 0]}
        scale={(1.5, 1.5, 1.5)}
      />
    </group>
  );

  return { gridBoxA, gridBoxB };
})();

export default Stage;
