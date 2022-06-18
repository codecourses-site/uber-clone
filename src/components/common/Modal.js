import React, { useState } from "react";

const withModal = (ModalComponent) => (WrapperComponent) => {
  return function () {
    const [isModalShown, setIsModalShown] = useState(false);

    return (
      <React.Fragment>
        <WrapperComponent toggleModal={setIsModalShown} />
        {isModalShown && <ModalComponent toggleModal={setIsModalShown} />}
      </React.Fragment>
    );
  };
};

export default withModal;
