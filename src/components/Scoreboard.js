import React from "react";

const Item = ({ heading, level, score }) => (
  <div className="scoreboard__item">
    <h3>{heading}</h3>
    <div className={"scoreboard__info"}>
      <p className={`scoreboard__info_${heading.toLowerCase()}`}>
        {heading === "Level" ? level : `${score}/${level * 5}`}
      </p>
    </div>
  </div>
);

const Scoreboard = ({ level, score }) => {
  return (
    <div className="scoreboard">
      <Item heading={"Level"} level={level} />
      <Item heading={"Cards"} level={level} score={score} />
    </div>
  );
};

export default Scoreboard;
