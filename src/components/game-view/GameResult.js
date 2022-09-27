import React from "react";
import { useThree } from "@react-three/fiber";
import { Flex, Box } from "@react-three/flex";
import { Text3D } from "@react-three/drei";

// import Sphere from "./Sphere";
import InterBold from "./facetype-fonts/Inter_Bold.json";
import degreesToRadian from "./utility/degressToRadian";

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
        justify="space-between"
        align={"flex-start"}
        width={"100%"}
        height={"100%"}
        flexGrow={1}
      >
        <Box centerAnchor={false} margin={0.05}>
          {/* <Sphere /> */}
        </Box>

        <Box centerAnchor={false} margin={0.05}>
          {() => {
            const flexScale = viewport.width / 12;

            return (
              <Text3D
                font={InterBold}
                scale={[flexScale, flexScale, flexScale]}
                position={[-0.11, 1, 0]}
                rotation={degreesToRadian([70, 0, 0])}
              >
                {gameResult ? gameResult.message : ""}
                <meshPhysicalMaterial
                  materialProps
                  color={gameResult ? gameResult.style : "white"}
                />
              </Text3D>
            );
          }}
        </Box>

        <Box centerAnchor={false} margin={0.05}>
          {/* <Sphere /> */}
        </Box>
      </Box>
    </Flex>
  );
};

export default GameResult;
