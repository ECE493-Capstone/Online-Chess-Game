import React, { useState, useEffect } from "react";
import Header from "../Header";
import Head2Head from "../Head2Head";
import Cookies from "universal-cookie";


const H2HTest = () => {

    const cookie = new Cookies();
    const storedUserId = cookie.get("userId");
    // SAMPLE:
    // const storedUserId = "65e2755c28bd77ea3394d6e5";
  return (
    <div>
        {/* <Header> */}
          <Head2Head PlayerId = {storedUserId}/>
        {/* </Header> */}
    </div>
  );
};

export default H2HTest;


// playerid:
// "66048fbaa9cde3a65f01e1d6"

// opponentid:
// "65e2753b28bd77ea3394d6df"


// player1
// "65e2755c28bd77ea3394d6e5"
// player2
// "65e2753b28bd77ea3394d6df"
// mode
// "standard"
// timeControl
// "5 + 0"
// room
// "Xl3RsQPWLnXeGBcDPI7jRxxjbkvH7uKB"
// pgn
// ""
// __v
// 0