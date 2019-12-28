import React, { useState } from "react";
import NextButton from "./NextButton";
import madlibs from "./madlibs.json";
import pallette from "./pallette.json";

const madlibIds = Object.keys(madlibs);

export default props => {
  const [madlibIndex, setMadlibIndex] = useState(
    Math.max(
      madlibIds.findIndex(title => title === props.globalState.madlib.madlibId),
      0
    )
  );
  const [responses, setResponses] = useState(
    props.globalState.madlib.responses
  );
  const [authorNickname, setAuthorNickname] = useState(
    props.globalState.madlib.authorNickname
  );

  const madlibId = React.useMemo(() => madlibIds[madlibIndex], [madlibIndex]);

  const placeholders = React.useMemo(
    () =>
      madlibs[madlibId]
        .match(/<(.*?)>/g)
        .map(s => s.substr(1).replace(/>$/, "")),
    [madlibId]
  );

  const rendering = React.useMemo(() => {
    const splitted = madlibs[madlibId].split(/<.*?>/g);

    const responsesForId = responses[madlibId] || {};

    return splitted.reduce((acc, curr, i) => {
      const arr = [<span key={i}>{curr}</span>];
      if (i < splitted.length - 1) {
        arr.push(
          <input
            key={`input-${i}`}
            autoFocus={i === 0}
            placeholder={placeholders[i]}
            className="madlib-input form-input"
            value={responsesForId[i] || ""}
            onChange={e =>
              setResponses({
                ...responses,
                [madlibId]: {
                  ...responsesForId,
                  [i]: e.target.value
                }
              })
            }
          />
        );
      }

      return acc.concat(arr);
    }, []);
  }, [madlibId, responses, placeholders]);

  const backgroundColor = React.useMemo(
    () => pallette[madlibIndex % pallette.length],
    [madlibIndex]
  );

  const nextButtonDisabled = React.useMemo(() => {
    if (!authorNickname) return true;

    const responsesForId = responses[madlibId] || {};
    for (let i = 0; i < placeholders.length; i++) {
      if (!responsesForId[i]) {
        return true;
      }
    }

    return false;
  }, [responses, madlibId, placeholders, authorNickname]);

  React.useEffect(() => {
    if (nextButtonDisabled) props.goToPage(props.pageIndex);
  }, [nextButtonDisabled]);

  React.useEffect(() => {
    props.setGlobalState({
      ...props.globalState,
      madlib: {
        responses,
        authorNickname,
        madlibId
      },
      isMadlibInvalid: nextButtonDisabled
    });
  }, [responses, authorNickname, madlibId, nextButtonDisabled]);

  return (
    <div className="page" style={{ backgroundColor }}>
      <div id="madlib-header" className="centered">
        <div
          className="madlib-arrow"
          id="madlib-arrow-left"
          onClick={() =>
            setMadlibIndex(
              madlibIndex - 1 >= 0 ? madlibIndex - 1 : madlibIds.length - 1
            )
          }
        ></div>
        <div
          className="madlib-arrow"
          id="madlib-arrow-right"
          onClick={() => setMadlibIndex((madlibIndex + 1) % madlibIds.length)}
        ></div>
        <span id="madlib-title" className="title">
          {madlibId}
        </span>
      </div>
      <div id="madlib-container" className="centered">
        {rendering}
        <div className="madlib-from-to">
          <div className="madlib-label">Written By:</div>
          <input
            onChange={e => setAuthorNickname(e.target.value)}
            value={authorNickname || ""}
            className="madlib-input form-input"
          />
        </div>
      </div>
      <div className="centered">
        <NextButton
          onClick={() => {
            props.goToPage(2);
          }}
          hidden={!props.isLastPage}
          disabled={nextButtonDisabled}
          text="Next"
        />
      </div>
    </div>
  );
};
