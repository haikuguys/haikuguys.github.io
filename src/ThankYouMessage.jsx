import React from "react";
import NextButton from "./NextButton";

export default () => (
  <div className="page" style={{ backgroundColor: "orange" }}>
    <h1 className="title">Thanks for your order!</h1>
    <div className="centered">We'll get that right to you</div>
    <div className="centered">
      <NextButton
        onClick={() => {
          location.href = "/";
        }}
        text="Wanna do another?"
      />
    </div>
  </div>
);
