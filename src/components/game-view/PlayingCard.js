import React, { useEffect, useRef, useState } from "react";

import { MathUtils } from "three";
import { useGLTF, useIntersect } from "@react-three/drei";
import { useFrame, invalidate } from "@react-three/fiber";

import webCard from "./assets/card/01.glb";
import degreesToRadian from "./utility/degressToRadian";

import svgCircleButton from "../../svg/circle-button.svg";

const setCursor = (active) => {
  const body = document.body;
  body.style.cursor = "auto";

  if (active) body.style.cursor = `url(${svgCircleButton}), pointer`;
};

const useEmissive = (state, ref, intensity) =>
  void (
    state &&
    ref.current.children.forEach((mesh) => {
      mesh.material.emissiveIntensity = intensity;
    })
  );

const PlayingCard = (() => {
  const inView = [];

  const lerp = (target, prop, value, speed = 0.025) =>
    (target[prop] = MathUtils.lerp(target[prop], value, speed));

  const create = (props) => {
    const ref = useRef();

    const { card, texture, scale, rotate, rotation, clr, selected } = props;
    const [choice, setChoice] = useState(false);
    const [hover, setHover] = useState(false);
    const setRotation = degreesToRadian(rotation);

    const { nodes, materials } = useGLTF(webCard);
    const materialKey = Object.keys(materials)[1];

    const meshRef = useIntersect((visible) => {
      //console.log("object is visible", visible, materialKey)
      //if (!inView.includes(card.rowIndex)) inView.push(card.rowIndex);
    });

    useEffect(() => setCursor(hover), [hover]);

    // Set emissiveIntensity to a high value like 3 on hover
    useEffect(() => {
      useEmissive(hover, ref, 0.5);
      useEmissive(choice, ref, 1.5);
    }, [choice, hover]);

    // Lerp it down to 0 constantly in the render loop
    useFrame((state, delta, xrFrame) => {
      ref.current.children.forEach((mesh) => {
        lerp(mesh.material, "emissiveIntensity", 0);
      });

      if (rotate) ref.current.rotation.y += delta;
    });

    return (
      <group
        {...props}
        dispose={null}
        ref={ref}
        scale={scale}
        rotation={setRotation}
        position={[0, 0, 0]}
        onPointerOver={(e) => setHover(true)}
        onPointerLeave={(e) => setHover(false)}
        onPointerDown={(e) => setChoice(true)}
        onPointerUp={(e) => setChoice(false)}
      >
        <mesh
          ref={meshRef}
          castShadow
          receiveShadow
          geometry={nodes.gameCard_1.geometry}
          onClick={(e) => {
            //selected(materialKey);
            selected(texture);
          }}
        >
          <meshStandardMaterial
            //map={materials[materialKey].map}
            map={texture}
            emissive="steelblue" // Emissive color, any color goes
            emissiveIntensity={0} // Intensity must be 0 initially
          />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.gameCard.geometry}>
          <meshStandardMaterial color={clr} map={materials["gameCase"].map} />
        </mesh>
      </group>
    );
  };

  useGLTF.preload(webCard);
  return { create, inView };
})();

export default PlayingCard;
