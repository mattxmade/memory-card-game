import React from "react";
import { useThree } from "@react-three/fiber";
import { Flex, Box } from "@react-three/flex";
import { GradientTexture, Text3D } from "@react-three/drei";

// import Sphere from "./Sphere";
import InterBold from "./facetype-fonts/Inter_Bold.json";
import degreesToRadian from "./utility/degressToRadian";
import isTouchDevice from "./utility/isTouchDevice";

const GameResult = ({ gameResult }) => {
  const { viewport } = useThree();

  const flexProps = {
    paddingTop: 0.1,
    flexDir: "column",
    justify: "center",
    alignItems: "center",
    alignContent: "flex-start",
    size: [viewport.width, viewport.height, 0],
  };

  const flexContainerPosition = [
    -viewport.width / 2 + 0.1,
    viewport.height / 2 - 0.1,
    0,
  ];

  return (
    <Flex {...flexProps} position={flexContainerPosition}>
      <Box
        flexDir={"row"}
        justify="space-evenly"
        align={"flex-start"}
        width={"100%"}
        height={"100%"}
        flexGrow={1}
      >
        <Box centerAnchor={false} margin={0.05}>
          {/* {!isTouchDevice() ? <Sphere position={[0, 1, -3]} /> : ""} */}
        </Box>

        <Box centerAnchor={false} margin={0.05}>
          {() => {
            const flexScale = viewport.width / 12;

            return (
              <Text3D
                font={InterBold}
                scale={[flexScale, flexScale, flexScale]}
                position={[-0.11, 1, 1]}
                rotation={degreesToRadian([70, 0, 0])}
              >
                {gameResult ? gameResult.message : ""}
                <meshPhysicalMaterial
                  wireframw={true}
                  color={gameResult ? gameResult.style : "white"}
                >
                  <GradientTexture
                    stops={[0, 1]} // As many stops as you want
                    colors={["aquamarine", "hotpink"]} // Colors need to match the number of stops
                    size={1024} // Size is optional, default = 1024
                  />
                </meshPhysicalMaterial>
              </Text3D>
            );
          }}
        </Box>

        <Box centerAnchor={false} margin={0.05}>
          {/* {!isTouchDevice() ? <Sphere position={[0, 1, -3]} /> : ""} */}
        </Box>
      </Box>
    </Flex>
  );
};

export default GameResult;
