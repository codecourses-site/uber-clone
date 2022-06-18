import React, { useContext } from "react";
import { CometChatMessages } from "../../cometchat-pro-react-ui-kit/CometChatWorkspace/src";

import Context from "../../context";

const Chat = () => {
  const { user, currentRide } = useContext(Context);

  const findUser = () => {
    if (!user || !currentRide) return;
    if (user.role === "passenger" && currentRide?.driver?.id) {
      return currentRide.driver.id;
    } else if (user.role === "driver" && currentRide?.requestor?.id) {
      return currentRide.requestor.id;
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <CometChatMessages chatWithUser={findUser()} />
    </div>
  );
};

export default Chat;
