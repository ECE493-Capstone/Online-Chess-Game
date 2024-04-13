const clientConfig = require("./clientConfig.js"); // Make sure to keep the extension as .js
const { getPastGamesInformation } = require("./pastGames.js"); // Make sure to keep the extension as .js
const bcrypt = require("bcryptjs");
const { Builder, By, Key, until, Actions, Select } = require('selenium-webdriver');

let failures = 0;
let successes = 0;
let testsran = 0;

async function gameRoomTests() {
    let PlayerA = await new Builder().forBrowser('chrome').build();
    let PlayerB = await new Builder().forBrowser('chrome').build();

    try {

        // Connect to client URL for user 1
        await PlayerA.get(clientConfig.CLIENT_URL);
        // // Connect to client URL for user 2
        await PlayerB.get(clientConfig.CLIENT_URL);

        console.log("================================================================");
        console.log("-----TEST SUITE 3: GAME ROOM-----");
    
        console.log("Testing Criteria 1, 2, and 3: Test that the user can select a time limit for every selection, and that the creator can select a side. Opponent assumes other side:");
    
        // Simulate user 1 entering matchmaking queue
        await AWhiteBBlack(PlayerA, PlayerB);

        await ABlackBWhite(PlayerA, PlayerB);
    
      } catch (error) {
        console.error("A test failure occurred. Terminating tests: " + error);
      } finally {
        console.log("================================================================");
        console.log("Tests Ran: " + testsran);
        console.log("Successes: " + successes);
        console.log("Failures: " + failures);
        console.log("================================================================");
    }
}

async function AWhiteBBlack(PlayerA, PlayerB) {

  // first make sure that both players are at home screen.

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
  await PlayerA.findElement(By.id('standard-select')).click();
  await new Promise(resolve => setTimeout(resolve, 1000));
  await PlayerA.findElement(By.xpath('(//div[@class="tc-row"]/button)[5]')).click();
  await PlayerA.findElement(By.id('play-as-white')).click();
  await PlayerA.findElement(By.id('time-submit')).click();
  await new Promise(resolve => setTimeout(resolve, 500));

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

  try {
      const gameBoardA = await PlayerA.findElement(By.id('game-board'));

      // Check if the dialog container is displayed
      const gameSideA = await gameBoardA.getAttribute("game-side");

      // console.log("game side found: " + gameSideA);

      const gameBoardB = await PlayerB.findElement(By.id('game-board'));

      // Check if the dialog container is displayed
      const gameSideB = await gameBoardB.getAttribute("game-side");

      // console.log("game side found: " + gameSideB);
      
      if (gameSideA !== "w" || gameSideB !== "b") {
        throw new Error("Player A isn't white, and/or Player B isn't black");
      }
      successes++;
    }
    catch (error) {
        failures++;
        console.error("Failed: " + error);
    }
    testsran++;

  try {
    const gameTimer = await PlayerA.findElement(By.id('timer-container'));
    const time = await gameTimer.getAttribute("timer");
    // console.log("Timer found: " + time);

    if (time !== "5:00") {
      throw new Error("Timer is incorrect.");
    }
  successes++;
  }
  catch (error) {
      failures++;
      console.error("Failed: " + error);
  }
  testsran++;
  await new Promise(resolve => setTimeout(resolve, 1000));
  await PlayerA.findElement(By.id('resign-button')).click();
  await new Promise(resolve => setTimeout(resolve, 1000));

  await PlayerA.quit();
  await PlayerB.quit();

}

async function ABlackBWhite(PlayerA, PlayerB) {

  PlayerA = await new Builder().forBrowser('chrome').build();
  PlayerB = await new Builder().forBrowser('chrome').build();

  await PlayerA.get(clientConfig.CLIENT_URL);
  await PlayerB.get(clientConfig.CLIENT_URL);

  await PlayerA.findElement(By.id('signin')).click();

  await PlayerA.findElement(By.id('identity')).sendKeys('PlayerA');
  await PlayerA.findElement(By.id('password')).sendKeys('playera');
  await PlayerA.findElement(By.css('button[type="submit"]')).click();

  await PlayerB.findElement(By.id('signin')).click();

  await PlayerB.findElement(By.id('identity')).sendKeys('PlayerB');
  await PlayerB.findElement(By.id('password')).sendKeys('playerb');
  await PlayerB.findElement(By.css('button[type="submit"]')).click();

  console.log("Test ID 1:");

  await PlayerA.findElement(By.id('create-game')).click();
  await new Promise(resolve => setTimeout(resolve, 1000));
  await PlayerA.findElement(By.id('standard-select')).click();
  await new Promise(resolve => setTimeout(resolve, 1000));
  await PlayerA.findElement(By.xpath('(//div[@class="tc-row"]/button)[5]')).click();
  await PlayerA.findElement(By.id('play-as-black')).click();
  await PlayerA.findElement(By.id('time-submit')).click();
  await new Promise(resolve => setTimeout(resolve, 1000));
  await PlayerA.findElement(By.id('share-room-code')).click();

  await new Promise(resolve => setTimeout(resolve, 500));
  const shareButton = await PlayerA.findElement(By.id('share-room-code'));
  const gameLink = await shareButton.getAttribute("share-code");
  
  await new Promise(resolve => setTimeout(resolve, 500));

  await PlayerB.findElement(By.id('join-game')).click();

  await PlayerB.findElement(By.id('room-code')).sendKeys(gameLink);

  await PlayerB.findElement(By.id('join-room-submit')).click();
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Need the room code bruh

  try {
      const gameBoardA = await PlayerA.findElement(By.id('game-board'));

      // Check if the dialog container is displayed
      const gameSideA = await gameBoardA.getAttribute("game-side");

      // console.log("game side found: " + gameSideA);

      const gameBoardB = await PlayerB.findElement(By.id('game-board'));

      // Check if the dialog container is displayed
      const gameSideB = await gameBoardB.getAttribute("game-side");

      // console.log("game side found: " + gameSideB);
      
      if (gameSideA !== "b" || gameSideB !== "w") {
        throw new Error("Player A isn't white, and/or Player B isn't black");
      }
      successes++;
    }
    catch (error) {
        failures++;
        console.error("Failed: " + error);
    }
    testsran++;

    await new Promise(resolve => setTimeout(resolve, 1000));
    await PlayerA.findElement(By.id('resign-button')).click();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Quit both WebDriver instances
    await PlayerA.quit();
    await PlayerB.quit();
}

module.exports = gameRoomTests;