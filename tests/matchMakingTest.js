const clientConfig = require("./clientConfig.js"); // Make sure to keep the extension as .js
const { getPastGamesInformation } = require("./pastGames.js"); // Make sure to keep the extension as .js
const bcrypt = require("bcryptjs");
const { Builder, By, Key, until, Actions, Select } = require('selenium-webdriver');
// const firefox = require('selenium-webdriver/firefox');
// const opera = require('selenium-webdriver/opera');

let failures = 0;
let successes = 0;
let testsran = 0;

async function matchMakingTests() {
    let PlayerA = await new Builder().forBrowser('chrome').build();
    let PlayerB = await new Builder().forBrowser('chrome').build();
    let PlayerC = await new Builder().forBrowser('chrome').build();
    let PlayerD = await new Builder().forBrowser('chrome').build();
    let PlayerE = await new Builder().forBrowser('chrome').build();
    // let PlayerC = await new Builder().forBrowser('firefox').setFirefoxOptions(new firefox.Options()).build();
    // let PlayerD = await new Builder().forBrowser('opera').setOperaOptions(new opera.Options()).build();

    try {

        // Connect to client URL for user 1
        await PlayerA.get(clientConfig.CLIENT_URL);
        // // Connect to client URL for user 2
        await PlayerB.get(clientConfig.CLIENT_URL);
        await PlayerC.get(clientConfig.CLIENT_URL);
        await PlayerD.get(clientConfig.CLIENT_URL);

        console.log("================================================================");
        console.log("-----TEST SUITE 2: MATCHMAKING-----");
    
        console.log("Testing Criteria 1 and 2: Test players enter queue with FIFO, and that they will be paired with their selected game mode:");
    
        // Simulate user 1 entering matchmaking queue
        await testFIFO(PlayerA, PlayerB, PlayerC, PlayerD);

        console.log("Testing Criteria 3: Check that players may disconnect during queuing:");

        await testExit(PlayerA, PlayerE);
    
      } catch (error) {
        console.error("A test failure occurred. Terminating tests: " + error);
      } finally {
        console.log("================================================================");
        console.log("Tests Ran: " + testsran);
        console.log("Successes: " + successes);
        console.log("Failures: " + failures);
        console.log("================================================================");
    
        // Quit both WebDriver instances
    }
}

async function testFIFO(PlayerA, PlayerB, PlayerC, PlayerD) {

    // login first

    await PlayerA.findElement(By.id('signin')).click();

    await PlayerA.findElement(By.id('identity')).sendKeys('PlayerA');
    await PlayerA.findElement(By.id('password')).sendKeys('playera');
    await PlayerA.findElement(By.css('button[type="submit"]')).click();

    await PlayerB.findElement(By.id('signin')).click();

    await PlayerB.findElement(By.id('identity')).sendKeys('PlayerB');
    await PlayerB.findElement(By.id('password')).sendKeys('playerb');
    await PlayerB.findElement(By.css('button[type="submit"]')).click();

    await PlayerC.findElement(By.id('signin')).click();

    await PlayerC.findElement(By.id('identity')).sendKeys('PlayerC');
    await PlayerC.findElement(By.id('password')).sendKeys('playerc');
    await PlayerC.findElement(By.css('button[type="submit"]')).click();

    await PlayerD.findElement(By.id('signin')).click();

    await PlayerD.findElement(By.id('identity')).sendKeys('PlayerD');
    await PlayerD.findElement(By.id('password')).sendKeys('playerd');
    await PlayerD.findElement(By.css('button[type="submit"]')).click();
  
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log("Test ID 0:");

    // fuckin log in first
    await PlayerA.findElement(By.id('quick-play')).click();
    await PlayerB.findElement(By.id('quick-play')).click();
    await PlayerC.findElement(By.id('quick-play')).click();
    await PlayerD.findElement(By.id('quick-play')).click();
    await new Promise(resolve => setTimeout(resolve, 1000));


    await PlayerA.findElement(By.id('standard-select')).click();
    await PlayerB.findElement(By.id('blind-select')).click();
    await PlayerC.findElement(By.id('blind-select')).click();
    await PlayerD.findElement(By.id('standard-select')).click();
    await new Promise(resolve => setTimeout(resolve, 1000));

    await PlayerA.findElement(By.id('time-submit')).click();
    await PlayerB.findElement(By.id('time-submit')).click();
    await PlayerC.findElement(By.id('time-submit')).click();
    await PlayerD.findElement(By.id('time-submit')).click();

    await new Promise(resolve => setTimeout(resolve, 1000));
  
    // now check that the players are paired up correctly
  
    try {

        const playerAPlayerNameDiv = await PlayerA.findElement(By.id("player-name"));

        // Locate the h2 element within the infoDiv
        const usernameElementA = await playerAPlayerNameDiv.findElement(By.css("h2"));

        // Get the text content of the username element
        const displayedUsernameA = await usernameElementA.getText();

        // // Now you can assert or perform actions based on the displayed username
        // console.log("Displayed Username:", displayedUsernameA);

        const playerAOpponentNameDiv = await PlayerA.findElement(By.id("opponent-name"));

        // Locate the h2 element within the infoDiv
        const opponentnameElementA = await playerAOpponentNameDiv.findElement(By.css("h2"));

        // Get the text content of the username element
        const displayedOpponentnameA = await opponentnameElementA.getText();

        if (displayedUsernameA !== "PlayerA" || displayedOpponentnameA !== "PlayerD") {
            throw new Error('Players do not match up correctly');
        }

        const playerBPlayerNameDiv = await PlayerB.findElement(By.id("player-name"));

        // Locate the h2 element within the infoDiv
        const usernameElementB = await playerBPlayerNameDiv.findElement(By.css("h2"));

        // Get the text content of the username element
        const displayedUsernameB = await usernameElementB.getText();

        // // Now you can assert or perform actions based on the displayed username
        // console.log("Displayed Username:", displayedUsernameA);

        const playerBOpponentNameDiv = await PlayerB.findElement(By.id("opponent-name"));

        // Locate the h2 element within the infoDiv
        const opponentnameElementB = await playerBOpponentNameDiv.findElement(By.css("h2"));

        // Get the text content of the username element
        const displayedOpponentnameB = await opponentnameElementB.getText();

        if (displayedUsernameB !== "PlayerB" || displayedOpponentnameB !== "PlayerC") {
            throw new Error('Players do not match up correctly');
        }

        successes++;

    }
    catch (error) {
      failures++;
      console.error("Failed: " + error);
    }
  
    testsran++;

    await new Promise(resolve => setTimeout(resolve, 3000));
    await PlayerA.findElement(By.id('resign-button')).click();
    await PlayerC.findElement(By.id('resign-button')).click();
    await new Promise(resolve => setTimeout(resolve, 1000));

    PlayerA.quit();
    PlayerB.quit();
    PlayerC.quit();
    PlayerD.quit();
  
}

async function testExit(PlayerA, PlayerE) {

    // first make sure that both players are at home screen.

    // await PlayerA.findElement(By.id('signin')).click();

    // await PlayerA.findElement(By.id('identity')).sendKeys('PlayerA');
    // await PlayerA.findElement(By.id('password')).sendKeys('playera');
    // await PlayerA.findElement(By.css('button[type="submit"]')).click();

    PlayerA = await new Builder().forBrowser('chrome').build();
    await PlayerA.get(clientConfig.CLIENT_URL);
    
    await PlayerE.get(clientConfig.CLIENT_URL);
    await PlayerA.findElement(By.id('signin')).click();

    await PlayerA.findElement(By.id('identity')).sendKeys('PlayerA');
    await PlayerA.findElement(By.id('password')).sendKeys('playera');
    await PlayerA.findElement(By.css('button[type="submit"]')).click();

    await PlayerE.findElement(By.id('signin')).click();

    await PlayerE.findElement(By.id('identity')).sendKeys('PlayerE');
    await PlayerE.findElement(By.id('password')).sendKeys('playere');
    await PlayerE.findElement(By.css('button[type="submit"]')).click();

    await PlayerA.findElement(By.id('quick-play')).click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await PlayerA.findElement(By.id('standard-select')).click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await PlayerA.findElement(By.id('time-submit')).click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await PlayerA.findElement(By.id('cancel')).click();

    await new Promise(resolve => setTimeout(resolve, 1000));

    await PlayerE.findElement(By.id('quick-play')).click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await PlayerE.findElement(By.id('standard-select')).click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await PlayerE.findElement(By.id('time-submit')).click();
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        const dialogContainer = await PlayerE.findElement(By.id('queue-container'));

        // Check if the dialog container is displayed
        const isDisplayed = await dialogContainer.isDisplayed();
        
        if (!isDisplayed) {
            throw new Error("Player A wasn't removed from queue");
        }
        successes++;
    }
    catch (error) {
        failures++;
        console.error("Failed: " + error);
    }
    testsran++;

    await PlayerE.findElement(By.id('cancel')).click();
    PlayerA.quit();
    PlayerE.quit();

}


module.exports = matchMakingTests;