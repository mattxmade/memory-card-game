import React from "react";
import { Box } from "@react-three/flex";
import PlayingCard from "./PlayingCard";

const PsxCard = (props) => {
  //console.count("Card render");

  const GameplayCard = PlayingCard.create;
  const { card, clr, scale, rotation, selected, texture } = props;

  return (
    <GameplayCard
      card={card}
      texture={texture}
      cardRef={card}
      clr={clr}
      scale={scale}
      rotation={rotation}
      selected={selected}
    />
  );
};

const FiveCardFlexRow = ({ cardSet, selected, materials }) => {
  //console.count("Row render");
  let cardIndex = 0;

  return (
    <Box flexDir={"row"} justify="center" wrap={"wrap"}>
      {cardSet.map((card, index) => {
        const clr = cardIndex === 0 ? "black" : "white";

        cardIndex++;

        return (
          <Box key={index} centerAnchor={false} margin={0.05}>
            <PsxCard
              card={card}
              texture={materials[card.deckIndex]}
              clr={clr}
              scale={[0.1, 0.1, 0.1]}
              rotation={[180, 0, 0]}
              selected={selected}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default FiveCardFlexRow;
