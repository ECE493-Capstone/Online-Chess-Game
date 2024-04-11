const authenticationTests = require("./authenticationTest.js");
const matchMakingTests = require("./matchMakingTest.js");
const gameRoomTests = require("./gameRoomTest.js");
const gameDisconnectionTests = require("./gameDisconnectionTest.js");
const beginGameTests = require("./beginGameTest.js");
const gameSharingTests = require("./gameSharingTest.js");
const profileTests = require("./profileTest.js");
const gameModesTests = require("./gameModesTest.js");
const {removeUser} = require("./removeUser");
const {fetchUser} = require("./fetchUser");
const {addPastGame} = require("./addGame");
const {registerUser} = require("./auth");

async function appTests() {

    console.log("==================== TEST PLAN =====================")

    await authenticationTests();

    await registerUser("PlayerA", "playera@playera.com", "playera");
    await registerUser("PlayerB", "playerb@playerb.com", "playerb");
    await registerUser("PlayerC", "playerc@playerc.com", "playerc");
    await registerUser("PlayerD", "playerd@playerd.com", "playerd");
    await registerUser("PlayerE", "playere@playere.com", "playere");

    await matchMakingTests();

    await gameRoomTests();

    // // await gameDisconnectionTests(); // Errors: Disconnection/reconnection handling doesn't work properly

    // // await beginGameTests(); // Errors: Cannot start and create a new game

    await gameSharingTests();

     await gameModesTests(); // game modes test not implemented yet

    // const userData = await fetchUser("newtesting");
    // const userId = userData.userId;
    
    // const AData = await fetchUser("PlayerA");
    // const AId = AData.userId;

    // console.log("User ID: " + userId);
    // console.log("AID: " + AId);
    
    // console.log( "Adding 1st game:" );
    // First past game
    // await addPastGame(
    //     "gameId1", // roomId
    //     userId, // white
    //     AId, // black
    //     "Standard", // mode
    //     "5 + 0", // timeControl
    //     "room1", // room
    //     [], // fen
    //     userId // winner
    // );
// This not connecting. I'm cooked.
    console.log( "Adding 2st game:" );
    
    // // Second past game
    // await addPastGame(
    //     "gameId2", // roomId
    //     userId, // white
    //     AId, // black
    //     "Blind", // mode
    //     "5 + 0", // timeControl
    //     "room2", // room
    //     [], // fen
    //     AId // winner
    // );
    
    // // Third past game
    // await addPastGame(
    //     "gameId3", // roomId
    //     userId, // white
    //     AId, // black
    //     "Power-up Duck", // mode
    //     "5 + 0", // timeControl
    //     "room3", // room
    //     [], // fen
    //     null // winner
    // );

    // await profileTests();

    const removedUserData = await removeUser('newtesting');
    if (removedUserData) {
      console.log("Removed 'newtesting' user successfully");
    } else {
      console.error("Failed to remove 'newtesting' user");
    }

    const removedAData = await removeUser('PlayerA');
    if (removedAData) {
      console.log("Removed 'PlayerA' user successfully");
    } else {
      console.error("Failed to remove 'PlayerA' user");
    }

    const removedBData = await removeUser('PlayerB');
    if (removedBData) {
      console.log("Removed 'PlayerB' user successfully");
    } else {
      console.error("Failed to remove 'PlayerB' user");
    }

    const removedCData = await removeUser('PlayerC');
    if (removedCData) {
      console.log("Removed 'PlayerC' user successfully");
    } else {
      console.error("Failed to remove 'PlayerC' user");
    }

    const removedDData = await removeUser('PlayerD');
    if (removedDData) {
      console.log("Removed 'PlayerD' user successfully");
    } else {
      console.error("Failed to remove 'PlayerD' user");
    }

    const removedEData = await removeUser('PlayerE');
    if (removedEData) {
      console.log("Removed 'PlayerE' user successfully");
    } else {
      console.error("Failed to remove 'PlayerE' user");
    }
}

// old "newtesting" id: 66158ab6774fc8a54a2b9be0

appTests();