import { Button } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { TimeControlCategories } from "../app/constant";

const StyledTimeControlDiv = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 20px;
  .tc-row {
    display: flex;
    .tc-box {
      color: white;
      cursor: pointer;
      display: flex;
      box-shadow: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-width: 150px;
      min-height: 125px;
      margin: 5px;
      h1 {
        margin: 0px;
      }
    }
  }
  .selected {
    background-color: #00abe3 !important;
    opacity: 1 !important;
  }
`;

const TimeSelect = ({ handleTimeControlClick }) => {
  const [tcId, setTcId] = useState(0);
  const handleButtonClick = (e) => {
    const tcId = parseInt(e.currentTarget.value) - 1;
    handleTimeControlClick(
      TimeControlCategories[Math.floor(tcId / 3)][tcId % 3].tc
    );
    setTcId(tcId);
  };
  return (
    <StyledTimeControlDiv>
      {TimeControlCategories.map((tcRow, rowIndex) => (
        <div className="tc-row" key={rowIndex}>
          {tcRow.map((tcCat) => (
            <Button
              className={`tc-box ${tcCat.id === tcId + 1 ? "selected" : ""}`}
              value={tcCat.id}
              onClick={handleButtonClick}
              key={tcCat.id}
              variant="filled"
              style={{ backgroundColor: "black" }}
            >
              <h1>{tcCat.tc}</h1>
              <span>{tcCat.name}</span>
            </Button>
          ))}
        </div>
      ))}
    </StyledTimeControlDiv>
  );
};

export default TimeSelect;
