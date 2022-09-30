import React, { Fragment } from "react";
import "../styles/nav-controls.css";

const NavControls = ({ setToggleView, setScrollUp, setScrollDown }) => {
  const configModal = document.querySelector("dialog");
  const audioElement = document.querySelector(".sfx-open");

  return (
    <Fragment>
      <ol className="nav-controls heads-up-display">
        <li
          className="nav-controls__item heads-up-display__item"
          onClick={(e) => {
            e.preventDefault();
            setScrollUp(true);
          }}
        />
        <li className="nav-controls__item heads-up-display__item">
          <button
            onClick={(e) => {
              e.preventDefault();

              // initial angle dataset prop is undefined
              // this will set dataset prop to change-view-angle on click
              // next click will result in first case being true, resetting angle

              switch (e.target.dataset.angle) {
                case "change-view-angle":
                  e.target.dataset.angle = "reset-view-angle";
                  break;

                default:
                  e.target.dataset.angle = "change-view-angle";
                  break;
              }

              setToggleView(e.target.dataset.angle);
            }}
          >
            {"o"}
          </button>
          <span>{"view"}</span>
        </li>
        <li
          className="nav-controls__item heads-up-display__item"
          onClick={(e) => {
            e.preventDefault();
            setScrollDown(true);
          }}
        />
      </ol>
      <div
        className="nav-controls__item heads-up-display__item config-icon"
        onClick={(e) => {
          e.preventDefault();
          configModal.showModal();
          if (audioElement) audioElement.play();
        }}
      >
        <i className="fas fa-gamepad"></i>
      </div>
    </Fragment>
  );
};

export default NavControls;
