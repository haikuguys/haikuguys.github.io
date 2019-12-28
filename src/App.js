import React, { useState } from "react";
// import logo from "./logo.svg";
import "./App.css";
import Home from "./Home";
import Madlib from "./Madlib";
import OrderOptionsForm from "./OrderOptionsForm";
import OrderInfoForm from "./OrderInfoForm";
import ThankYouMessage from "./ThankYouMessage";

const ALL_PAGES = [
  Home,
  Madlib,
  OrderOptionsForm,
  OrderInfoForm,
  ThankYouMessage
];

const App = () => {
  // const [pageIndicesShown, setPageIndicesShown] = useState([0, 1, 2, 3, 4]);
  const [pageIndex, setPageIndex] = useState(0);
  const [globalState, setGlobalState] = useState({
    // madlib: {
    //   responses: {}
    // },
    orderInfo: {},
    isMadlibInvalid: true,
    madlib: {
      responses: {
        "A Total Mess": {
          "0": "shit",
          "1": "Scotty",
          "2": "Louie",
          "3": "maybe the baby can hang",
          "4": "diarrhea",
          "5": "subside",
          "6": "laxatives",
          "7": "baby shower"
        },
        "Never On Time": {
          "0": "0",
          "1": "1",
          "2": "2",
          "3": "3",
          "4": "4",
          "5": "5",
          "6": "6"
        }
      },
      authorNickname: "Erick",
      // madlibId: "A Total Mess"
      madlibId: "Never On Time"
    }
    // orderInfo: {
    //   senderFirstName: "senderFirstName",
    //   senderLastName: "senderLastName",
    //   senderEmail: "senderEmail@gmail.com",
    //   senderAgreementToEmailList: "senderAgreementToEmailList",
    //   recipientFirstName: "recipientFirstName",
    //   recipientLastName: "recipientLastName",
    //   recipientEmail: "recipientEmail@gmail.com",
    //   deliveryAddress1: "deliveryAddress1",
    //   deliveryAddress2: "deliveryAddress2",
    //   deliveryZip: "deliveryZip",
    //   deliveryCity: "deliveryCity",
    //   deliveryState: "deliveryState"
    // },
    // isMadlibInvalid: false,
    // orderType: "email_to_friend_and_self"
  });

  // console.log(`----------- globalState`, JSON.stringify(globalState, null, 2));

  React.useEffect(() => {
    const pageEls = document.getElementsByClassName("page");
    window.scrollTo(0, pageEls[pageEls.length - 1].offsetTop);
  }, [pageIndex, globalState.orderType]);

  // console.log(`----------- globalState`, globalState);
  // console.log(`----------- globalState`, globalState);
  // console.log(
  //   `----------- globalState.madlib.responses`,
  //   globalState.madlib &&
  //     globalState.madlib.responses &&
  //     JSON.stringify(globalState.madlib.responses, null, 2)
  // );

  const rendering = [];

  for (let _pageIndex = 0; _pageIndex <= pageIndex; _pageIndex++) {
    const Page = ALL_PAGES[_pageIndex];
    rendering.push(
      <Page
        key={_pageIndex}
        globalState={globalState}
        setGlobalState={setGlobalState}
        isLastPage={_pageIndex === pageIndex}
        pageIndex={_pageIndex}
        goToPage={i => {
          // if (pageIndicesShown.includes(i))
          //   setPageIndicesShown([...pageIndicesShown]);
          // else
          //   setPageIndicesShown(
          //     i < pageIndicesShown[pageIndicesShown.length - 1]
          //       ? pageIndicesShown.slice(
          //           0,
          //           pageIndicesShown.indexOf(pageIndex) + 1
          //         )
          //       : [...pageIndicesShown, i]
          //   );

          setPageIndex(i);
        }}
      />
    );
  }

  return rendering;
};

export default App;
