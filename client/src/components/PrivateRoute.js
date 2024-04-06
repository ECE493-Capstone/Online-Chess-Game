import React from "react";
import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const cookies = new Cookies();
  const userId = cookies.get("userId");
  console.log(userId);
  return userId ? children : <Navigate to={"/test"} />;
};

export default PrivateRoute;
