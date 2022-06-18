import React, { useEffect, useRef, useContext } from "react";
import validator from "validator";
import { useHistory } from "react-router-dom";

import withModal from "../common/Modal";
import SignUp from "../register/SignUp";

import Context from "../../context";

import * as cometChatService from "../../services/cometchat";
import * as firebaseService from "../../services/firebase";
import * as uiService from "../../services/ui";

const Login = ({ toggleModal }) => {
  const { cometChat, setUser } = useContext(Context);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const history = useHistory();

  useEffect(() => {
    const authedUser = JSON.parse(localStorage.getItem("auth"));
    if (authedUser) {
      history.push("/");
    } else {
      setUser(null);
    }
  }, [history, setUser]);

  const login = async () => {
    try {
      uiService.showLoading();
      const { email, password } = getInputs();
      if (isUserCredentialsValid(email, password)) {
        await firebaseService.login(email, password);
        const user = await firebaseService.getSingleDataWithQuery({
          key: "users",
          query: "email",
          criteria: email,
        });
        await cometChatService.login(cometChat, user);
        saveAuthedInfo(user);
        uiService.hideLoading();
        history.push("/");
      } else {
        uiService.hideLoading();
        uiService.alert(`Your user's name or password is not correct`);
      }
    } catch (error) {
      uiService.hideLoading();
    }
  };

  const getInputs = () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    return { email, password };
  };

  const isUserCredentialsValid = (email, password) => {
    return validator.isEmail(email) && password;
  };

  const saveAuthedInfo = (user) => {
    setUser(user);
    localStorage.setItem("auth", JSON.stringify(user));
  };

  return (
    <div className="login__container">
      <div className="login__welcome">
        <p>
          Build{" "}
          <span style={{ color: "#000000", fontWeight: "bold" }}>
            Uber Clone
          </span>{" "}
          with React
        </p>
      </div>
      <div className="login__form-container">
        <div className="login__form">
          <input
            type="text"
            placeholder="Email or phone number"
            ref={emailRef}
          />
          <input type="password" placeholder="Password" ref={passwordRef} />
          <button className="login__submit-btn" onClick={login}>
            Login
          </button>
          <span className="login__forgot-password">Forgot password?</span>
          <span className="login__signup" onClick={() => toggleModal(true)}>
            Create New Account
          </span>
        </div>
      </div>
    </div>
  );
};

export default withModal(SignUp)(Login);
