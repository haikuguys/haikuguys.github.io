import React from "react";
import NextButton from "./NextButton";

export default props => (
  <div className="page">
    <div className="title">Home</div>
    <NextButton onClick={() => props.goToPage(1)} text="Try it out" />
  </div>
);
