import { nanoid } from "nanoid";

const Gameplay = (() => {
  const newCardSet = (numOfSetsRequired, allCards) => {
    const gameObjects = [];
    const indexTracker = [];

    let uniqueIndex = 0;
    const totalNumOfCards = numOfSetsRequired * 5;

    while (gameObjects.length < totalNumOfCards) {
      const index = allCards[Math.floor(Math.random() * allCards.length)];

      if (!indexTracker.includes(index)) {
        const cardGameObject = {
          id: nanoid(),
          rowIndex: uniqueIndex,
          deckIndex: index,
        };

        uniqueIndex++;
        gameObjects.push(cardGameObject);

        indexTracker.push(index);
      }

      if (gameObjects.length === totalNumOfCards) break;
    }

    return gameObjects;
  };

  const shuffleIndexOrder = (array, stopper) => {
    const shuffledArray = [];
    let uniqueIndex = 0;

    const arrayIndexRandomiser = (array) => {
      return Math.floor(Math.random() * array.length);
    };

    while (uniqueIndex < stopper) {
      const newIndex = arrayIndexRandomiser(array);

      if (!shuffledArray.includes(newIndex)) {
        uniqueIndex++;
        shuffledArray.push(newIndex);
      }

      if (uniqueIndex === stopper) break;
    }

    return shuffledArray;
  };

  return { newCardSet, shuffleIndexOrder };
})();

export default Gameplay;
