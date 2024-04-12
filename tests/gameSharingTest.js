const clientConfig = require("./clientConfig.js"); // Make sure to keep the extension as .js
const { getPastGamesInformation } = require("./pastGames.js"); // Make sure to keep the extension as .js
const bcrypt = require("bcryptjs");
const { Builder, By, Key, until, Actions, Select } = require('selenium-webdriver');

let failures = 0;
let successes = 0;
let testsran = 0;

async function gameSharingTests() {
    let PlayerA = await new Builder().forBrowser('chrome').build();
    let PlayerB = await new Builder().forBrowser('chrome').build();
    let PlayerC = await new Builder().forBrowser('chrome').build();

    try {

        // Connect to client URL for user 1
        await PlayerA.get(clientConfig.CLIENT_URL);
        // // Connect to client URL for user 2
        await PlayerB.get(clientConfig.CLIENT_URL);

        console.log("================================================================");
        console.log("-----TEST SUITE 6: GAME SHARING & SPECTATING-----");
    
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

    await PlayerA.findElement(By.id('share-btn')).click();
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        const toastContainer = await PlayerA.findElement(By.id('share-toast'));

        // Check if the dialog container is displayed
        const isDisplayed = await toastContainer.isDisplayed();
        
        if (!isDisplayed) {
            throw new Error("Game link not copied to Player A's clipboard");
        }
        console.log("Passed");
        successes++;
    }
    catch (error) {
        failures++;
        console.error("Failed");
    }
    testsran++;

  // now let playerA share the link to the spectator

  const shareButton = await PlayerA.findElement(By.id('share-btn'));
  const gameLink = await shareButton.getAttribute("clipboard-target");

    try {
        await PlayerC.get(gameLink);

        await new Promise(resolve => setTimeout(resolve, 3000));
    
        const playerNameDiv = await PlayerC.findElement(By.id("player-name"));
    
        const playerNameElement = await playerNameDiv.findElement(By.css("h2"));
    
        // Get the text content of the username element
        const displayedPlayerName = await playerNameElement.getText();

        // console.log("Spectator got: " + displayedPlayerName);
    
        if (displayedPlayerName !== "PlayerB" && displayedPlayerName !== "PlayerA") {
        throw new Error('Spectator do not join match');
        }

        successes++;
    } catch (error) {
        failures++;
        console.error("Failed");
    }
    testsran++;
    await new Promise(resolve => setTimeout(resolve, 3000));
    await PlayerA.findElement(By.id('resign-button')).click();
    await new Promise(resolve => setTimeout(resolve, 1000));
}

module.exports = gameSharingTests;