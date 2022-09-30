import React from "react";
import "./styles/scoreboard.css";

const Item = ({ heading, level, score }) => (
  <div className="scoreboard__item heads-up-display__item">
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
    <div className="scoreboard heads-up-display">
      <Item heading={"Level"} level={level} />
      <Item heading={"Cards"} level={level} score={score} />
    </div>
  );
};

export default Scoreboard;
