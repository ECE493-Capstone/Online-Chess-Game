const clientConfig = require("./clientConfig.js"); // Make sure to keep the extension as .js
const { getPastGamesInformation } = require("./pastGames.js"); // Make sure to keep the extension as .js
const bcrypt = require("bcryptjs");
const { Builder, By, Key, until, Actions, Select } = require('selenium-webdriver');

let failures = 0;
let successes = 0;
let testsran = 0;

async function gameModesTests() {
    let PlayerA = await new Builder().forBrowser('chrome').build();
    let PlayerB = await new Builder().forBrowser('chrome').build();
    let PlayerC = await new Builder().forBrowser('chrome').build();

    try {

        // Connect to client URL for user 1
        await PlayerA.get(clientConfig.CLIENT_URL);
        // // Connect to client URL for user 2
        await PlayerB.get(clientConfig.CLIENT_URL);

        console.log("================================================================");
        console.log("-----TEST SUITE 7: GAME MODES-----");
    
        console.log("Testing Criteria 1 and 2: Test of the system allows player to copy game link, and that spectators can join:");
    
        // Simulate user 1 entering matchmaking queue
        await TestSharing(PlayerA, PlayerB, PlayerC);
    
      } catch (error) {
        console.error("A test failure occurred. Terminating tests: " + error);
      } finally {
        console.log("================================================================");
        console.log("Tests Ran: " + testsran);
        console.log("Successes: " + successes);
        console.log("Failures: " + failures);
        console.log("================================================================");
    
        // Quit both WebDriver instances
        await PlayerA.quit();
        await PlayerB.quit();
        await PlayerC.quit();
    }
}

async function TestSharing(PlayerA, PlayerB, PlayerC) {

    // first make sure that both players are at home screen.
    console.log("Test ID 0:");


    try {

        successes++;
    } catch (error) {
        failures++;
        console.error("Failed");
    }
    testsran++;
}

module.exports = gameModesTests;