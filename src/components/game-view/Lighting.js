import React from "react";

const Lighting = (props) => (
  <>
    <directionalLight
      args={["white"]}
      color="whitesmoke"
      position={[-2, 0, 150]}
      intensity={0.5}
    />
    <ambientLight intensity={0.5} />
    <spotLight
      position={[1, 10, 25]}
      penumbra={1}
      angle={0.2}
      color="white"
      castShadow
      intensity={1}
      shadow-mapSize={[512, 512]}
    />
    <directionalLight position={[0, -15, -0]} intensity={4} color="steelblue" />
  </>
);

export default Lighting;
