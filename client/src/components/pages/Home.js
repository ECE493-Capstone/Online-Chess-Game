import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import Header from "./Header";
import "../styles.css";

const Home = () => {
  return (
    <Header>
      <div>
        <h1>Home Page</h1>
        {/* Add your home page content here */}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", minHeight: "80vh", paddingBottom: "20px"}}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
        <Button variant="contained" className="button" style={{ marginRight: "10px", width: "300px", height: "83px", textTransform: "none"}}>
          <div>
            <div style={{ fontSize: "20px" }}>Quick Play</div>
            <div style={{ fontSize: "14px" }}>Standard, blind, or power up chess</div>
          </div>
        </Button>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Button variant="contained" className="button" style={{ marginBottom: "10px", width: "150px", textTransform: "none"}}>Create Game</Button>
            <Button variant="contained" className="button" style={{ width: "150px", textTransform: "none"}}>Join Game</Button>
          </div>
        </div>
      </div>
    </Header>
  );
};

export default Home;
