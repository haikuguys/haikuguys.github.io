import React from "react";
export default props => {
  return props.hidden ? null : (
    <div className="button-container">
      <button
        className="button"
        onClick={props.onClick}
        disabled={props.disabled}
      >
        {props.text}
      </button>
    </div>
  );
};
