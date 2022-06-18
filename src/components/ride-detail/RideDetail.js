import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import * as firebaseService from "../../services/firebase";
import * as uiService from "../../services/ui";

import Context from "../../context";

const RideDetail = ({ user, isDriver, currentRide }) => {
  const { setCurrentRide } = useContext(Context);

  const history = useHistory();

  const cancelRide = () => {
    const isCancel = window.confirm("Do you want to cancel this ride?");
    if (isCancel) {
      currentRide.status = "canceled";
      updateRide(currentRide);
    }
  };

  const finishRide = () => {
    const isFinish = window.confirm("Do you want to finish this ride?");
    if (isFinish) {
      currentRide.status = "done";
      updateRide(currentRide);
    }
  };

  const updateRide = async (ride) => {
    uiService.showLoading();
    try {
      await firebaseService.insert({
        key: "rides",
        id: ride.rideUuid,
        payload: ride,
      });
    } catch (error) {
      uiService.hideLoading();
    }
    uiService.hideLoading();
    removeRide();
  };

  const removeRide = () => {
    localStorage.removeItem("currentRide");
    setCurrentRide(null);
    window.location.reload();
  };

  const talkToUser = () => {
    history.push("/chat");
  };

  return (
    <div className="ride-detail">
      <div className="ride-detail__user-avatar">
        <img src={user.image} alt={user.email} />
      </div>
      <p className="ride-detail__user-info">
        {user.email} - {user.phone}
      </p>
      <div className="ride-detail__actions">
        <p className="ride-detail__result-label">
          <span>From: </span>
          {currentRide.pickup && currentRide.pickup.label
            ? currentRide.pickup.label
            : ""}
        </p>
        <p className="ride-detail__result-label">
          <span>To: </span>
          {currentRide.destination && currentRide.destination.label
            ? currentRide.destination.label
            : ""}
        </p>
        <button className="ride-detail__btn" onClick={talkToUser}>
          {isDriver ? "Talk to User" : "Talk to Driver"}
        </button>
        <button className="ride-detail__btn" onClick={cancelRide}>
          Cancel the Ride
        </button>
        {isDriver && (
          <button className="ride-detail__btn" onClick={finishRide}>
            Finish the Ride
          </button>
        )}
      </div>
    </div>
  );
};

export default RideDetail;
