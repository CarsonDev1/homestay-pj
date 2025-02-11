import React from "react";

const BoxContainer = ({ children, property }) => {
  return <div className={property}>{children}</div>;
};

export default BoxContainer;
