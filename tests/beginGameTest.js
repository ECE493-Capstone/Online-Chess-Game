const clientConfig = require("./clientConfig.js"); // Make sure to keep the extension as .js
const { getPastGamesInformation } = require("./pastGames.js"); // Make sure to keep the extension as .js
const bcrypt = require("bcryptjs");
const { Builder, By, Key, until, Actions, Select } = require('selenium-webdriver');

let failures = 0;
let successes = 0;
let testsran = 0;

async function beginGameTests() {
    let PlayerA = await new Builder().forBrowser('chrome').build();
    let PlayerB = await new Builder().forBrowser('chrome').build();

    try {

        // Connect to client URL for user 1
        await PlayerA.get(clientConfig.CLIENT_URL);
        // // Connect to client URL for user 2
        await PlayerB.get(clientConfig.CLIENT_URL);

        console.log("================================================================");
        console.log("-----TEST SUITE 5: BEGIN GAME-----");
    
        console.log("Testing Criteria 1, 9, and 11: Test that board and H2H mounts, and H2H displays 0 for both players:");
    
        // Simulate user 1 entering matchmaking queue
        await TestMount(PlayerA, PlayerB);

        console.log("Testing Criteria 8 and 19: Test that PlayerA loses if time runs out, and stores the loss/win into database:");

        await TestTimeUp(PlayerA, PlayerB);

        console.log("Testing Criteria 10: Test that H2H properly displays the game results:");

        await TestH2H(PlayerA, PlayerB);
    
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
    }
}

async function TestMount(PlayerA, PlayerB) {

    // first make sure that both players are at home screen.
    console.log("Test ID 0:");

    await PlayerA.findElement(By.id('signin')).click();

    await PlayerA.findElement(By.id('identity')).sendKeys('PlayerA');
    await PlayerA.findElement(By.id('password')).sendKeys('playera');
    await PlayerA.findElement(By.css('button[type="submit"]')).click();

    await PlayerB.findElement(By.id('signin')).click();

    await PlayerB.findElement(By.id('identity')).sendKeys('PlayerB');
    await PlayerB.findElement(By.id('password')).sendKeys('playerb');
    await PlayerB.findElement(By.css('button[type="submit"]')).click();

    // await PlayerA.findElement(By.id('quick-play')).click();
    // await new Promise(resolve => setTimeout(resolve, 1000));
    // await PlayerA.findElement(By.id('standard-select')).click();
    // await new Promise(resolve => setTimeout(resolve, 1000));
    // await PlayerA.findElement(By.id('time-submit')).click();
    // await new Promise(resolve => setTimeout(resolve, 1000));

    // await PlayerB.findElement(By.id('quick-play')).click();
    // await new Promise(resolve => setTimeout(resolve, 1000));
    // await PlayerB.findElement(By.id('standard-select')).click();
    // await new Promise(resolve => setTimeout(resolve, 1000));
    // await PlayerB.findElement(By.id('time-submit')).click();
    // await new Promise(resolve => setTimeout(resolve, 1000));

    // playType: null,
    // gameMode: null,
    // time: "1 + 0",
    // side: "r",

    // I NEED THE FUCKIN GAME ROOM CODE BRUH

    try {
        const boardContainer = await PlayerA.findElement(By.id('game-board'));

        // Check if the dialog container is displayed
        const isDisplayed = await boardContainer.isDisplayed();
        
        if (!isDisplayed) {
            throw new Error("Board component did not mount");
        }
        console.log("Passed");
        successes++;
    }
    catch (error) {
        failures++;
        console.error("Failed");
    }
    testsran++;

    try {
        const H2HContainer = await PlayerA.findElement(By.id('h2h'));

        // Check if the dialog container is displayed
        const isDisplayed = await H2HContainer.isDisplayed();
        
        if (!isDisplayed) {
            throw new Error("H2H component did not mount");
        }
        console.log("Passed");
        successes++;
    }
    catch (error) {
        failures++;
        console.error("Failed");
    }
    testsran++;

    // Check that H2H component displays all 0s. For this to work, the assumption needs to hold where Players A and B have yet to play against each other.
}

async function TestTimeUp(PlayerA, PlayerB) {

    console.log("Test ID 1:");

    await new Promise(resolve => setTimeout(resolve, 61000));

    try {
        const PlayerAResult = await PlayerA.findElement(By.id('game-result'));
        const PlayerBResult = await PlayerB.findElement(By.id('game-result'));

        const PlayerAText = await PlayerAResult.getText();
        console.log('Game Result:', PlayerAText);
        const PlayerBText = await PlayerBResult.getText();

        // Check if the dialog container is displayed
        
        if (PlayerAText !== "You lost!" || PlayerBText !== "You won!") {
            throw new Error("Game did not make Player A lose.");
        }
        console.log("Passed");
        successes++;
    }
    catch (error) {
        failures++;
        console.error("Failed:" + error);
    }
    testsran++;

    getPastGamesInformation(playerACookie)

    // Test that game is stored into database
    // maybe have it so that I can retreive the game info from dastabase with given game ID??

}

async function TestH2H(PlayerA, PlayerB) {

    console.log("Test ID 1:");

    await new Promise(resolve => setTimeout(resolve, 61000));

    try {
        const PlayerAResult = await PlayerA.findElement(By.id('game-result'));
        const PlayerBResult = await PlayerB.findElement(By.id('game-result'));

        const PlayerAText = await PlayerAResult.getText();
        console.log('Game Result:', PlayerAText);
        const PlayerBText = await PlayerBResult.getText();

        // Check if the dialog container is displayed
        
        if (PlayerAText !== "You lost!" || PlayerBText !== "You won!") {
            throw new Error("Game did not make Player A lose.");
        }
        console.log("Passed");
        successes++;
    }
    catch (error) {
        failures++;
        console.error("Failed:" + error);
    }
    testsran++;

    getPastGamesInformation(playerACookie)

    // Test that game is stored into database
    // maybe have it so that I can retreive the game info from dastabase with given game ID??

}

beginGameTests();