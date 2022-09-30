import React, { useRef } from "react";
import { LinearEncoding } from "three";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import "./assets/models/memory-card/credit.txt";
import memoryCard from "./assets/models/memory-card/MemoryCard.glb";

export default function MemoryCard({
  color,
  scale,
  position,
  rotate,
  rotation,
  ...props
}) {
  const { nodes, materials } = useGLTF(memoryCard);

  const ref = useRef();
  useFrame((state, delta) => {
    if (rotate) ref.current.rotation.y += delta;
  });

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        // receiveShadow
        geometry={nodes.MemoryCard.geometry}
        ref={ref}
        position={position}
        rotation={rotation ? rotation : [3.14, 0, 0]}
        scale={scale}
      >
        <meshStandardMaterial
          color={color}
          map={materials["Memory_Card"].map}
          normalMap={materials["Memory_Card"].normalMap}
          normalMap-encoding={LinearEncoding}
          roughnessMap={materials["Memory_Card"].roughnessMap}
          metalnessMap={materials["Memory_Card"].metalnessMap}
          envMapIntensity={0.8}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload(memoryCard);
