const clientConfig = require("./clientConfig.js"); // Make sure to keep the extension as .js
const { getPastGamesInformation } = require("./pastGames.js"); // Make sure to keep the extension as .js
const bcrypt = require("bcryptjs");
const { Builder, By, Key, until, Actions, Select } = require('selenium-webdriver');

let failures = 0;
let successes = 0;
let testsran = 0;

async function gameDisconnectionTests() {
    let PlayerA = await new Builder().forBrowser('chrome').build();
    let PlayerB = await new Builder().forBrowser('chrome').build();

    try {

        // Connect to client URL for user 1
        await PlayerA.get(clientConfig.CLIENT_URL);
        // // Connect to client URL for user 2
        await PlayerB.get(clientConfig.CLIENT_URL);

        console.log("================================================================");
        console.log("-----TEST SUITE 4: GAME DISCONNECTION-----");
    
        console.log("Testing Criteria 3 and 4: Test that the game reconnects after Player A disconnects and reconnects within 60 seconds:");
    
        // Simulate user 1 entering matchmaking queue
        await TestReconnect(PlayerA, PlayerB);

        console.log("Testing Criteria 1: Test that Player A loses if they don't reconnect within 60 seconds:");

        await TestNoReconnect(PlayerA, PlayerB);
    
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

async function TestReconnect(PlayerA, PlayerB) {

  // first make sure that both players are at home screen.

  await PlayerA.findElement(By.id('signin')).click();

  await PlayerA.findElement(By.id('identity')).sendKeys('PlayerA');
  await PlayerA.findElement(By.id('password')).sendKeys('playera');
  await PlayerA.findElement(By.css('button[type="submit"]')).click();

  await PlayerB.findElement(By.id('signin')).click();

  await PlayerB.findElement(By.id('identity')).sendKeys('PlayerB');
  await PlayerB.findElement(By.id('password')).sendKeys('playerb');
  await PlayerB.findElement(By.css('button[type="submit"]')).click();

  await PlayerA.findElement(By.id('quick-play')).click();
  await new Promise(resolve => setTimeout(resolve, 1000));
  await PlayerA.findElement(By.id('standard-select')).click();
  await new Promise(resolve => setTimeout(resolve, 1000));
  await PlayerA.findElement(By.xpath('(//div[@class="tc-row"]/button)[5]')).click();
  await PlayerA.findElement(By.id('time-submit')).click();
  await new Promise(resolve => setTimeout(resolve, 1000));

  await PlayerB.findElement(By.id('quick-play')).click();
  await new Promise(resolve => setTimeout(resolve, 1000));
  await PlayerB.findElement(By.id('standard-select')).click();
  await new Promise(resolve => setTimeout(resolve, 1000));
  await PlayerB.findElement(By.xpath('(//div[@class="tc-row"]/button)[5]')).click();
  await PlayerB.findElement(By.id('time-submit')).click();
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log("Test ID 0:");

  const currentUrl = await PlayerA.getCurrentUrl();
  console.log("Current URL:", currentUrl);

  await PlayerA.navigate().back();

  // Navigate PlayerA back to previous screen
  

  await new Promise(resolve => setTimeout(resolve, 1000));

  await PlayerA.get(currentUrl);

  await new Promise(resolve => setTimeout(resolve, 1000));



  try {

      const squareSelector1 = `.board-row:nth-child(${7}) .board-square:nth-child(${5})`;
      await PlayerA.findElement(By.css(squareSelector1)).click();
      await new Promise(resolve => setTimeout(resolve, 500));
    
      const squareSelector2 = `.board-row:nth-child(${5}) .board-square:nth-child(${5})`;
      await PlayerA.findElement(By.css(squareSelector2)).click();
      await new Promise(resolve => setTimeout(resolve, 500));
      // Check that pawn is at location
      const square1 = `.board-row:nth-child(${4}) .board-square:nth-child(${4})`;
      const NSquare1 = await PlayerB.findElement(By.css(square1));
      const NsSquare1 = await NSquare1.findElement(By.id("square-piece"));
      const pawnPiece = await NsSquare1.getAttribute("piece")

      if (pawnPiece !== "p") {
          throw new Error("Player did not properly connect.");
      }
      console.log("Passed");
      successes++;
  }
  catch (error) {
      failures++;
      console.error("Failed:" + error);
  }

  testsran++;

}

async function TestNoReconnect(PlayerA, PlayerB) {

  console.log("Test ID 1:");

  await PlayerA.quit();

  // waiting for 60 seconds
  await new Promise(resolve => setTimeout(resolve, 61000));

  try {
    const PlayerBResult = await PlayerB.findElement(By.id('game-result'));

    const PlayerBText = await PlayerBResult.getText();

    // Check if the dialog container is displayed
    
    if (PlayerBText !== "You won!") {
        throw new Error("No reconnections not handled properly");
    }
    console.log("Passed");
    successes++;
  }
  catch (error) {
      failures++;
      console.error("Failed:" + error);
  }
  testsran++;

  await PlayerB.quit();

}

module.exports = gameDisconnectionTests;