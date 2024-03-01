import React from "react";
import { Button } from "@mui/material";

const HeaderElements = () => {
  return (
    <div style={{ backgroundColor: "#f0f0f0", padding: "10px", display: "flex", justifyContent: "flex-end" }}>
      <Button variant="contained" style={{ backgroundColor: "transparent", marginRight: "5px", textTransform: "none" }}>Sign in</Button>
      <Button variant="contained" style={{ backgroundColor: "red", marginRight: "5px", textTransform: "none" }}>Sign up</Button>
    </div>
  );
};

const Header = ({ children }) => {
  return (
    <div>
      <HeaderElements />
      <div>{children}</div>
    </div>
  );
};

export default Header;
