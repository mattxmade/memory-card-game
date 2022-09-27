import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";

import Gameplay from "../Gameplay";
import FiveCardFlexRow from "./FiveCardFlexRow";

const totalNumberOfCards = [...new Array(50).fill(0)].map(
  (item, index) => (item = index)
);

const CardsView = (props) => {
  //console.count("Game view render");
  const { level, score, setLevel, setScore, setGameResult } = props;

  const newCardSet = Gameplay.newCardSet;
  const shuffleIndexOrder = Gameplay.shuffleIndexOrder;

  const numOfRows = level; // each level is a row of 5 cards
  const [cards, setCards] = useState(newCardSet(numOfRows, totalNumberOfCards));

  const [requestNewCards, setRequestNewCards] = useState(false);
  const [requestReshuffle, setRequestReshuffle] = useState(false);
  const [requestNextLevel, setRequestNextLevel] = useState(false);

  const [selected, setSelected] = useState();
  const [trackSelected, setTrackSelected] = useState([]);

  // feedback :: player selects card
  useEffect(() => {
    if (selected) {
      if (trackSelected.includes(selected)) {
        // restart game
        setSelected();
        setTrackSelected([]);

        setLevel(1);
        setScore(0);

        setGameResult({ message: "Try again...", style: "red" });

        setTimeout(() => {
          setRequestNewCards(true);
        }, 4200);

        return;
      }

      // continue play
      setTrackSelected(trackSelected.concat(selected));

      setScore(score + 1);
      setRequestReshuffle(true);

      setSelected();
    }
  }, [selected]);

  // reshuffle cards
  useEffect(() => {
    if (requestReshuffle) {
      setCards(() => {
        const indexShuffle = shuffleIndexOrder(cards, cards.length);
        return cards.map((card, index) => cards[indexShuffle[index]]);
      });

      setRequestReshuffle(false);
    }
  }, [requestReshuffle]);

  // new cards, same number of rows (level unchanged)
  useEffect(() => {
    if (requestNewCards) {
      setCards(newCardSet(numOfRows, totalNumberOfCards));
      setRequestNewCards(false);
    }
  }, [requestNewCards]);

  // level increase + 1 new row of cards
  useEffect(() => {
    if (requestNextLevel) {
      if (level < 10) {
        setLevel(level + 1);
        setRequestNewCards(true);
      }

      setScore(0);
      setRequestNextLevel(false);
    }
  }, [requestNextLevel]);

  // level completed / won the game
  useEffect(() => {
    if (trackSelected.length === cards.length) {
      setRequestNextLevel(true);
      setGameResult({ message: "Great memory!", style: "lightgrey" });

      setTrackSelected([]);
    }
  }, [trackSelected]);

  let set = 0;
  let fiveCardSet = [];

  return cards.map((card, index) => {
    if (set === 5) {
      set = 0;
      fiveCardSet = [];
    }

    fiveCardSet.push(card);
    set++;

    if (set === 5) {
      return (
        <FiveCardFlexRow
          key={nanoid()}
          indexPos={index}
          materials={props.materials}
          cardSet={fiveCardSet}
          selected={setSelected}
        />
      );
    }
  });
};

export default CardsView;
