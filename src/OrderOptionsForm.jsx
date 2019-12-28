import React from "react";

const actionOptions = [
  {
    h1: "Send me an email with my madlib",
    h2: "Free",
    p: (
      <p>(Email will contain option to purchase at LibBlib at a later date.)</p>
    ),
    orderType: "email_to_self"
  },
  {
    h1: "Send me and a friend an email with my madlib",
    h2: "Free",
    p: (
      <p>(Email will contain option to purchase at LibBlib at a later date.)</p>
    ),
    orderType: "email_to_friend_and_self"
  },
  {
    h1: "Send my friend a LibBlib by snail mail",
    h2: "$15",
    p: (
      <p>
        A LibBlib is a customized, hand-drawn artwork to accompany your madlib.
        Want to see examples?{" "}
        <a onClick={e => e.stopPropagation()} target="_blank" href="#">
          Click here.
        </a>{" "}
        Don't worry, we won't close this page.
      </p>
    ),
    orderType: "libblib"
  }
];

export default props => {
  return (
    <div className="page" style={{ backgroundColor: "orange" }}>
      <h1 className="title">What next?</h1>
      <div className="action-options">
        {actionOptions.map(ao => (
          <div
            key={ao.orderType}
            className="action-option-container"
            onClick={() => {
              props.setGlobalState({
                ...props.globalState,
                orderType: ao.orderType
              });
              props.goToPage(3);
            }}
          >
            <div className="action-option form-next-button">
              <h1>{ao.h1}</h1>
              <h2>{ao.h2}</h2>
              {ao.p}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
