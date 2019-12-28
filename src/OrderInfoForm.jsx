import React from "react";
import NextButton from "./NextButton";
import US_STATES from "./us-states.json";
import madlibs from "./madlibs.json";

const isEmailValid = email =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

const SECTIONS = {
  SENDER_BASIC_DETAILS: {
    header: "Your",
    fields: [
      { label: "first", name: "senderFirstName", validations: ["required"] },
      { label: "last", name: "senderLastName", validations: ["required"] },
      {
        label: "email",
        name: "senderEmail",
        validations: ["required", "email"]
      },
      {
        label: "enroll to our email list?",
        name: "senderAgreementToEmailList",
        type: "checkbox"
      }
    ]
  },
  RECIPIENT_BASIC_DETAILS: {
    header: "Their",
    fields: [
      { label: "first", name: "recipientFirstName", validations: ["required"] },
      { label: "last", name: "recipientLastName", validations: ["required"] },
      {
        label: "email",
        name: "recipientEmail",
        validations: ["required", "email"]
      },
      {
        text: "Don't worry, your friend won't be enrolled in any email list",
        type: "statictext"
      }
    ]
  },
  DELIVERY_OPTIONS: {
    header: "Where should we deliver?",
    fields: [
      {
        label: "Address 1",
        name: "deliveryAddress1",
        validations: ["required"]
      },
      {
        label: "Address 2",
        name: "deliveryAddress2"
      },
      { label: "ZIP", name: "deliveryZip", validations: ["required"] },
      { label: "City", name: "deliveryCity", validations: ["required"] },
      {
        label: "State",
        name: "deliveryState",
        type: "select",
        options: US_STATES,
        validations: ["required"]
      }
    ]
  },
  BILLING: {
    header: "Billing",
    fields: [{ type: "stripe" }]
  }
};

const FORM_CONFIGS = {
  email_to_self: [SECTIONS.SENDER_BASIC_DETAILS],
  email_to_friend_and_self: [
    SECTIONS.SENDER_BASIC_DETAILS,
    SECTIONS.RECIPIENT_BASIC_DETAILS
  ],
  libblib: [
    SECTIONS.SENDER_BASIC_DETAILS,
    SECTIONS.RECIPIENT_BASIC_DETAILS,
    SECTIONS.DELIVERY_OPTIONS,
    SECTIONS.BILLING
  ]
};

const fieldCreationMap = {
  text: (field, value = "", cb) => (
    <div>
      <label className="form-label">{field.label}</label>
      <input
        value={value}
        onChange={cb}
        className="form-input user-info-input"
        name={field.name}
      />
    </div>
  ),
  select: (field, value = "", cb) => (
    <div>
      <label className="form-label">{field.label}</label>
      <select
        onChange={cb}
        className="form-input user-info-input"
        name={field.name}
        value={value}
      >
        {[""].concat(field.options).map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  ),
  checkbox: (field, value = "", cb) => (
    <div className="checkbox-container">
      <label className="form-label">{field.label}</label>
      <input value={value} onChange={cb} type="checkbox" name={field.name} />
    </div>
  ),
  statictext: field => <div>{field.text}</div>,
  stripe: () => <div></div>
};

const validators = {
  required: Boolean,
  email: isEmailValid
};

const normalizeFields = ({ madlib, orderType, orderInfo }) => {
  const madlibResponses = madlib.responses[madlib.madlibId];
  const madlibSkeleton = madlibs[madlib.madlibId].split(/<.*?>/g);
  console.log(`----------- madlibSkeleton`, madlibSkeleton);

  const completeMadlib = madlibSkeleton
    .reduce((acc, curr, i) => {
      return acc.concat([
        curr,
        madlibResponses[i] ? `[${madlibResponses[i]}]` : ""
      ]);
    }, [])
    .join("");

  console.log(`----------- completeMadlib`, completeMadlib);

  // madlibs[madlibId].match(/<(.*?)>/g);
  return {
    authorNickname: madlib.authorNickname,
    madlibId: madlib.madlibId,
    completeMadlib,
    orderType,
    ...orderInfo
  };
};

const submitForm = (normalizedFields, globalState) => {
  const formData = new FormData();
  const request = new XMLHttpRequest();
  request.open("POST", "https://formspree.io/xoqvggor");
  for (const [key, val] of Object.entries(normalizedFields)) {
    formData.append(key, val);
  }

  formData.append("appState", JSON.stringify(globalState));

  request.send(formData);
};

const sendEmail = (normalizedFields, globalState) => {
  const request = new XMLHttpRequest();
  const query = encodeURIComponent(JSON.stringify(normalizedFields));
  const appState = encodeURIComponent(JSON.stringify(globalState));
  const url = `https://us-central1-libblibs.cloudfunctions.net/libblibs-email?q=${query}&appState=${appState}`;
  request.open("GET", url);
  request.send();

  request.onreadystatechange = e => {
    console.log(request.responseText);
  };
};

export default props => {
  const formConfig = FORM_CONFIGS[props.globalState.orderType];
  const [responses, setResponses] = React.useState(props.globalState.orderInfo);
  // const [responses, setResponses] = React.useState({});
  const nextButtonDisabled = React.useMemo(() => {
    for (const sectionConfig of formConfig) {
      for (const fieldConfig of sectionConfig.fields) {
        for (const validation of fieldConfig.validations || []) {
          if (!validators[validation](responses[fieldConfig.name])) return true;
        }
      }
    }

    return false;
  }, [responses]);

  React.useEffect(() => {
    props.setGlobalState({
      ...props.globalState,
      orderInfo: responses
    });
  }, [responses]);

  // console.log(`----------- responses`, responses);
  // console.log(`----------- formConfig`, formConfig);
  // console.log(`----------- nextButtonDisabled`, nextButtonDisabled);

  return (
    <div
      className="page page-expand-vertical"
      style={{ backgroundColor: "lightgreen" }}
    >
      <h1 className="title">Order details</h1>
      <div className="centered">
        {formConfig.map(config => (
          <div key={config.header} className="centered-65">
            <h2>{config.header}</h2>

            {config.fields.map((field, i) => (
              <React.Fragment key={i}>
                {fieldCreationMap[field.type || "text"](
                  field,
                  responses[field.name],
                  e =>
                    setResponses({
                      ...responses,
                      [e.target.name]: e.target.value
                    })
                )}
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
      <div className="centered">
        <NextButton
          hidden={!props.isLastPage}
          onClick={() => {
            const normalizedFields = normalizeFields(props.globalState);
            submitForm(normalizedFields, props.globalState);
            sendEmail(normalizedFields, props.globalState);
            props.goToPage(4);
          }}
          disabled={nextButtonDisabled || props.globalState.isMadlibInvalid}
          text="Let's do it!"
        />
      </div>
    </div>
  );
};

// const sgMail = require("@sendgrid/mail");
// /**
//  * Responds to any HTTP request.
//  *
//  * @param {!express:Request} req HTTP request context.
//  * @param {!express:Response} res HTTP response context.
//  */
// exports.sendEmails = (req, res) => {
//   const query = JSON.parse(decodeURIComponent(req.query.q));
//   const jsonText = JSON.stringify(query, null, 2);

//   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//   const msg1 = {
//     to: "inbox@libblibs.com",
//     from: "noreply@libblibs.com",
//     subject: `New Order (${query.orderType})`,
//     text: jsonText
//   };
//   const msg2 = {
//     to: query.senderEmail,
//     from: "noreply@libblibs.com",
//     subject: "Here's your new madlib",
//     text: `${query.completeMadlib}`,
//     html: "<strong>and easy to do anywhere, even with Node.js</strong>"
//   };
//   sgMail.send(msg1);
//   // sgMail.send(msg2);

//   res.status(200).send(message);
// };
