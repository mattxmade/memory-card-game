import React, { Fragment } from "react";
import open from "../sounds/01_open.mp3";
import close from "../sounds/02_close.mp3";
import alert from "../sounds/03_alert.mp3";

const Sounds = (props) => {
  return (
    <Fragment>
      <audio className="sfx-open" src={open}></audio>
      <audio className="sfx-close" src={close}></audio>
      <audio className="sfx-alert" src={alert}></audio>
    </Fragment>
  );
};

export default Sounds;
