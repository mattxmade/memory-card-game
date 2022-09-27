import React from "react";
import { Plane } from "@react-three/drei";
import degreesToRadian from "./utility/degressToRadian";

const Stage = (() => {
  const gridBoxA = ({ rotation, orientateGrid, orientateAxis }) => (
    <group rotation={rotation} position={[0, 0, -9]}>
      <gridHelper // back wall
        position={[0, 2.5, -7.5]}
        rotation={orientateGrid}
        scale={[1.5, 3, 1]}
      />

      <Plane // right wall panels
        receiveShadow
        scale={[15, 8, 1]}
        position={[7.5, 2.5, 0]}
        rotation={degreesToRadian([90, -90, 90])}
      >
        <meshPhongMaterial attach="material" color="#ffffff" />
      </Plane>

      <gridHelper // right grid
        position={[7.5, 2.5, 0]}
        rotation={degreesToRadian([90, 0, 90])}
        scale={[1.5, 3, 1]}
      />

      <Plane // ground
        scale={[15, 15, 1]}
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
        <meshPhongMaterial attach="material" color="#ffffff" />
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
