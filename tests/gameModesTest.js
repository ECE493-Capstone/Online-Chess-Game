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
    
        console.log("Testing Criteria 1: Test the duck moves to the voted location by spectators:");
    
        // Simulate user 1 entering matchmaking queue
        await TestMostVoted(PlayerA, PlayerB, PlayerC);
    
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

async function TestMostVoted(PlayerA, PlayerB, PlayerC) {

    await PlayerA.findElement(By.id('signin')).click();

    await PlayerA.findElement(By.id('identity')).sendKeys('PlayerA');
    await PlayerA.findElement(By.id('password')).sendKeys('playera');
    await PlayerA.findElement(By.css('button[type="submit"]')).click();
  
    await PlayerB.findElement(By.id('signin')).click();
  
    await PlayerB.findElement(By.id('identity')).sendKeys('PlayerB');
    await PlayerB.findElement(By.id('password')).sendKeys('playerb');
    await PlayerB.findElement(By.css('button[type="submit"]')).click();
  
    console.log("Test ID 0:");
  
    await PlayerA.findElement(By.id('create-game')).click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await PlayerA.findElement(By.id('power-up-select')).click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await PlayerA.findElement(By.xpath('(//div[@class="tc-row"]/button)[5]')).click();
    await PlayerA.findElement(By.id('play-as-white')).click();
    await PlayerA.findElement(By.id('time-submit')).click();
    await new Promise(resolve => setTimeout(resolve, 500));
  
    // READ ROOM CODE BRUH
    await PlayerA.findElement(By.id('share-room-code')).click();
  
    await new Promise(resolve => setTimeout(resolve, 500));
    const shareButton = await PlayerA.findElement(By.id('share-room-code'));
    const gameLink = await shareButton.getAttribute("share-code");
    
    // console.log("uuuh: " + gameLink);
    await new Promise(resolve => setTimeout(resolve, 500));
  
    await PlayerB.findElement(By.id('join-game')).click();
  
    await PlayerB.findElement(By.id('room-code')).sendKeys(gameLink);
  
    await PlayerB.findElement(By.id('join-room-submit')).click();
    await new Promise(resolve => setTimeout(resolve, 1000));

    await PlayerA.findElement(By.id('share-btn')).click();
    await new Promise(resolve => setTimeout(resolve, 500));


    const shareSpectator = await PlayerA.findElement(By.id('share-btn'));
    const gameLinkSpectator = await shareSpectator.getAttribute("clipboard-target");
  

    await PlayerC.get(gameLinkSpectator);

    await new Promise(resolve => setTimeout(resolve, 1000));

    // await PlayerA.findElement(By.id('square')).click();

    // Example row and column indices of the square you want to click

    // White: E
    const squareSelector1 = `.board-row:nth-child(${7}) .board-square:nth-child(${5})`;


    await PlayerA.findElement(By.css(squareSelector1)).click();


    await new Promise(resolve => setTimeout(resolve, 500));

    const squareSelector2 = `.board-row:nth-child(${5}) .board-square:nth-child(${5})`;

    await PlayerA.findElement(By.css(squareSelector2)).click();

    await new Promise(resolve => setTimeout(resolve, 500));

    const squareSelector3 = `.board-row:nth-child(${4}) .board-square:nth-child(${5})`;

    await PlayerC.findElement(By.css(squareSelector3)).click();

    await PlayerC.findElement(By.id("vote")).click();

    await new Promise(resolve => setTimeout(resolve, 11000));



    duckSquare = await PlayerC.findElement(By.css(squareSelector3));
    duckSquareN = await duckSquare.findElement(By.id("square-piece"));
    duckPiece = await duckSquareN.getAttribute("piece")

    // console.log("This is the piece at the location: " + duckPiece)
    
    try {
        if (duckPiece !== "D") {
            throw new Error("Duck piece not found in voted location");
        }
        successes++;
    } catch (error) {
        failures++;
        console.error("Failed");
    }
    testsran++;

    /// That's all I'm gonna impleent. Only come back to this if I have more time

    await new Promise(resolve => setTimeout(resolve, 1000));
    await PlayerA.findElement(By.id('resign-button')).click();
    await new Promise(resolve => setTimeout(resolve, 1000));

}

module.exports = gameModesTests;