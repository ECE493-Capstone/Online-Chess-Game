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
        // await TestReconnect(PlayerA, PlayerB);

        console.log("Testing Criteria 1: Test that Player A loses if they don't reconnect within 60 seconds:");

        await TestNoReconnect(PlayerA, PlayerB);

        console.log("Testing Criteria 2: Test that the system doesn’t save any history of the game after both players disconnect:");

        await TestNoSave(PlayerA, PlayerB);
    
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

  const gameWindowHandle = await PlayerA.getWindowHandle();

  PlayerA.navigate().back();

  // Navigate PlayerA back to previous screen

  await new Promise(resolve => setTimeout(resolve, 3000));

  // Navigate PlayerA back to current screen

//   await PlayerA.close();

//   await new Promise(resolve => setTimeout(resolve, 3000));

//   PlayerA = await new Builder().forBrowser('chrome').build();

//   await PlayerA.get(clientConfig.CLIENT_URL);

//   await new Promise(resolve => setTimeout(resolve, 1000));

//   await PlayerA.findElement(By.id('signin')).click();

//   await PlayerA.findElement(By.id('identity')).sendKeys('PlayerA');
//   await PlayerA.findElement(By.id('password')).sendKeys('playera');
//   await PlayerA.findElement(By.css('button[type="submit"]')).click();

  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    await PlayerB.findElement(By.id("reconnecting-dialog"));
    failures++;
    } catch (error) {
        successes++;
    }


  testsran++;

}

async function TestNoReconnect(PlayerA, PlayerB) {

    // --------------- COMMENT OUT --------------------
    await PlayerA.findElement(By.id('signin')).click();

    await PlayerA.findElement(By.id('identity')).sendKeys('PlayerA');
    await PlayerA.findElement(By.id('password')).sendKeys('playera');
    await PlayerA.findElement(By.css('button[type="submit"]')).click();
  
    await PlayerB.findElement(By.id('signin')).click();
  
    await PlayerB.findElement(By.id('identity')).sendKeys('PlayerB');
    await PlayerB.findElement(By.id('password')).sendKeys('playerb');
    await PlayerB.findElement(By.css('button[type="submit"]')).click();

    // --------------- COMMENT OUT --------------------

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
  
    PlayerA.close();

    await new Promise(resolve => setTimeout(resolve, 45000));

    // test that game wins for playerB, and lose for playerA

}

async function TestNoSave(PlayerA, PlayerB) {

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
  
    PlayerA.close();
    PlayerB.close();

    // test that the game is not saved in database

}

module.exports = gameDisconnectionTests;