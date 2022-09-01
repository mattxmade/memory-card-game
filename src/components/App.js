import React, { Fragment, useEffect, useState, useMemo } from "react";

import Menu from "./Menu";
import Intro from "./Intro";
import MemoryCard from "./MemoryCard";

const App = (props) => {
  return (
    <Fragment>
      <h1>Memory Card PSX</h1>
      <Intro />
      <Menu />
      <MemoryCard />
    </Fragment>
  );
};

export default App;
