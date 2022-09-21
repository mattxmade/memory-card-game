import React from "react";

const levelNumberStyle = {
  width: "35px",
  height: "35px",
  cursor: "pointer",
  borderRadius: "100%",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const LevelNumber = ({ index, active }) => {
  if (active)
    return (
      <div className={"scoreboard__page-index"} style={levelNumberStyle}>
        <p>{index}</p>
      </div>
    );
};

const scoreboardStyle = {
  width: "100px",
  height: "100%",
  marginLeft: "2.5px",
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexDirection: "column-reverse",

  cursor: "auto",

  item: {
    width: "100%",
    height: "100%",
    gap: "2px",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    placeContent: "center",
    justifyContent: "center",
  },
};

const Scoreboard = ({ level }) => {
  return (
    <aside style={scoreboardStyle}>
      <div style={scoreboardStyle.item}></div>
      <div style={scoreboardStyle.item}></div>
      <div className="scoreboard__item" style={scoreboardStyle.item}>
        {[...new Array(10)].map((item, i) => {
          const active = i < level ? true : false;

          return <LevelNumber key={i} index={i + 1} active={active} />;
        })}
      </div>
    </aside>
  );
};

export default Scoreboard;
