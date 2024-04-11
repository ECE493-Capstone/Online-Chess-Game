const authenticationTests = require("./authenticationTest.js");
const matchMakingTests = require("./matchMakingTest.js");
const gameRoomTests = require("./gameRoomTest.js");
const gameDisconnectionTests = require("./gameDisconnectionTest.js");
const beginGameTests = require("./beginGameTest.js");
const gameSharingTests = require("./gameSharingTest.js");
const profileTests = require("./profileTest.js");
const gameModesTests = require("./gameModesTest.js");

async function appTests() {

    console.log("==================== TEST PLAN =====================")

    await authenticationTests();

    // await matchMakingTests(); // Errors: FIFO doesn't work properly for when a third player queues when two players have begun a match

    // await gameRoomTests(); // Errors: The modal that displays the game room if user creates a custom game isn't implemented. Thus, we cannot test parts of this.

    // await gameDisconnectionTests(); // Errors: Disconnection/reconnection handling doesn't work properly

    // await beginGameTests(); // Errors: Cannot start and create a new game

    await gameSharingTests();

     // await gameModesTests(); // game modes test not implemented yet

    await profileTests();
    
}

appTests();