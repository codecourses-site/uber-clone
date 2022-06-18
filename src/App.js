import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Chat from "./components/chat/Chat";
import Home from "./components/home/Home";
import Loading from "./components/common/Loading";
import Login from "./components/login/Login";
import PrivateRoute from "./components/common/PrivateRoute";

import * as firebaseService from "./services/firebase";
import * as uiService from "./services/ui";

import Context from "./context";

import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [cometChat, setCometChat] = useState(null);
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);
  const [rideRequest, setRideRequest] = useState(null);
  const [currentRide, setCurrentRide] = useState(null);

  const fbCreatedRideRef = useRef();
  const fbCurrentRideRef = useRef();
  const lookingDriverTimeout = useRef();

  const lookingDriverMaxTime = 30000;

  const context = {
    user,
    setUser,
    cometChat,
    setCometChat,
    selectedFrom,
    setSelectedFrom,
    selectedTo,
    setSelectedTo,
    rideRequest,
    setRideRequest,
    currentRide,
    setCurrentRide,
  };

  const initAuthUser = () => {
    const authenticatedUser = localStorage.getItem("auth");
    if (authenticatedUser) {
      setUser(JSON.parse(authenticatedUser));
    }
  };

  const initCometChat = async () => {
    const { CometChat } = await import("@cometchat-pro/chat");
    const appID = `${process.env.REACT_APP_COMETCHAT_APP_ID}`;
    const region = `${process.env.REACT_APP_COMETCHAT_REGION}`;
    const appSetting = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(region)
      .build();
    CometChat.init(appID, appSetting).then(
      () => {
        setCometChat(() => CometChat);
      },
      (error) => {}
    );
  };

  const initCurrentRide = () => {
    const currentRide = localStorage.getItem("currentRide");
    if (currentRide) {
      const parsedCurrentRide = JSON.parse(currentRide);
      setCurrentRide(parsedCurrentRide);
      setSelectedFrom(parsedCurrentRide.pickup);
      setSelectedTo(parsedCurrentRide.destination);
    }
  };

  useEffect(() => {
    initAuthUser();
    initCometChat();
    initCurrentRide();
  }, []);

  const onCreatedRideRefUpdated = useCallback(
    (updatedRide) => {
      if (
        updatedRide?.rideUuid === rideRequest.rideUuid &&
        updatedRide?.driver
      ) {
        uiService.hideLoading();
        clearTimeout(lookingDriverTimeout.current);
        setRideRequest(null);
        localStorage.setItem("currentRide", JSON.stringify(updatedRide));
        setCurrentRide(updatedRide);
      }
    },
    [rideRequest]
  );

  useEffect(() => {
    if (rideRequest) {
      lookingDriverTimeout.current = setTimeout(() => {
        alert(
          "Cannot find your driver, please re-enter your pickup location and try again"
        );
        setRideRequest(null);
        uiService.hideLoading();
      }, lookingDriverMaxTime);
      uiService.showLoading();
      fbCreatedRideRef.current = firebaseService.getRef(
        `rides/${rideRequest.rideUuid}`
      );
      firebaseService.getDataRealtime(
        fbCreatedRideRef,
        onCreatedRideRefUpdated
      );
    }
  }, [rideRequest, onCreatedRideRefUpdated]);

  const onCurrentRideRefUpdated = useCallback(
    (updatedRide) => {
      if (
        updatedRide?.rideUuid === currentRide.rideUuid &&
        updatedRide?.driver &&
        (updatedRide?.status === "canceled" || updatedRide?.status === "done")
      ) {
        localStorage.removeItem("currentRide");
        setCurrentRide(null);
        window.location.reload();
      }
    },
    [currentRide]
  );

  useEffect(() => {
    if (currentRide) {
      fbCurrentRideRef.current = firebaseService.getRef(
        `rides/${currentRide.rideUuid}`
      );
      firebaseService.getDataRealtime(
        fbCurrentRideRef,
        onCurrentRideRefUpdated
      );
    }
  }, [currentRide, onCurrentRideRefUpdated]);

  return (
    <Context.Provider value={context}>
      <Router>
        <Switch>
          <PrivateRoute exact path="/" component={Home} />
          <PrivateRoute exact path="/chat" component={Chat} />
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </Router>
      <Loading />
    </Context.Provider>
  );
}

export default App;
