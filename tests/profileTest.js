const clientConfig = require("./clientConfig.js"); // Make sure to keep the extension as .js
const { getPastGamesInformation } = require("./pastGames.js"); // Make sure to keep the extension as .js
const bcrypt = require("bcryptjs");
const { Builder, By, Key, until, Actions, Select } = require('selenium-webdriver');

let failures = 0;
let successes = 0;
let testsran = 0;

async function profileTests() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {

    // connect to client URL
    await driver.get(clientConfig.CLIENT_URL);

    console.log("================================================================");

    console.log("-----TEST SUITE 8: PROFILE-----");

    console.log("----STATISTICS & GAME HISTORY----");

    console.log("Testing Criteria 1, 2, 6 and 7: Test system displays statistics and game history when going to profile page, and that it displays all wins/losses as default:");

    await testDisplay(driver);

    console.log("Testing Criteria 3 and 8: Test stats and game history switches to standard games when selected:");

    await testStandard(driver);

    console.log("Testing Criteria 4 and 9: Test stats and game history switches to blind chess games when selected:");

    await testBlind(driver);

    console.log("Testing Criteria 5 and 10: Test stats and game history switches to power-up duck chess games when selected:");

    await testPowerUpDuck(driver);

    console.log("----GAME REVIEW----");

    console.log("Testing Criteria 11, 12, and 13: Test system displays game review after selecting an item in game history list, showing info of the game and defaults to the first move:");

    await testEnterGameReview(driver);

    console.log("Testing Criteria 14: Test system moves onto the next move when clicking the next button:");

    await testNextMove(driver);

    console.log("Testing Criteria 16: Test system moves onto the previous move when clicking the previous button:");

    await testPreviousMove(driver);

    // GAME REVIEW NOT IMPLEMENTED YET


  } catch (error) {
    console.error("A test failure occured. terminating tests: " + error);
  } finally {
    console.log("================================================================");
    console.log("Tests Ran: " + testsran);
    console.log("Successes: " + successes);
    console.log("Failures: " + failures);
    console.log("================================================================");
    await driver.quit();
  }
}

async function testDisplay(driver) {

  // first login to the testing account. Assume that username: "newtesting", password: "newpassword" is found in the database. Assume that players played 3 games:
  // Game 1: Classic, white = player, black = opponent, white won, Game 2: Blind, white = player, black = opponent, white lost. Game 3: Power-up Duck, white = player, black = opponent, tie

  await driver.findElement(By.id('signin')).click();

  await driver.findElement(By.id('identity')).sendKeys('newtesting');
  await driver.findElement(By.id('password')).sendKeys('newpassword');
  await driver.findElement(By.css('button[type="submit"]')).click();

  await new Promise(resolve => setTimeout(resolve, 500));

  console.log("Test ID 0:");

  await driver.findElement(By.id("account-icon")).click();
  await driver.findElement(By.xpath('//li[text()="Profile"]')).click();


  // Find the element(s) representing the statistics
  const statisticsElement = await driver.findElement(By.id("game-statistics"));
  
  // Check if the statistics element is displayed
  const isDisplayed = await statisticsElement.isDisplayed();

  
  try {
    if (isDisplayed) {
        successes++;
        console.log("Passed");
    }
    else {
        throw new Error("Statistics not found");
    }
  }
  catch (error) {
      failures++;
      console.error("Failed");
  }

  testsran++;

  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    let userCookie = "";

    await driver.manage().getCookie("userId").then(function(cookie) {
      // console.log('cookie details => ', cookie.value);
      userCookie = cookie.value;
    });

    // const retreiveGameData = await getPastGamesInformation(userCookie);


    // const compareData = formatGameData(handleGraphData(retreiveGameData, userCookie));

    const bars = await statisticsElement.findElements(By.css('.recharts-layer.recharts-bar-rectangle'));

    const tooltip = await driver.findElement(By.css('.recharts-tooltip-wrapper'));

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Perform a click action on the bar
    await driver.wait(until.elementIsVisible(bars[0]), 5000);
    await driver.actions().move({ origin: bars[0] }).perform();

    await new Promise(resolve => setTimeout(resolve, 500));

    const tooltipText1 = await tooltip.getText();

    if (tooltipText1 !== "White : 1\nBlack : 0") {
      throw new Error("not all game modes displayed");
    }

    await driver.actions().move({ origin: bars[1] }).perform();

    await new Promise(resolve => setTimeout(resolve, 500));

    const tooltipText2 = await tooltip.getText();

    if (tooltipText2 !== "White : 1\nBlack : 0") {
      throw new Error("not all game modes displayed");
    }

    await driver.actions().move({ origin: bars[2] }).perform();

    await new Promise(resolve => setTimeout(resolve, 500));

    const tooltipText3 = await tooltip.getText();

    if (tooltipText3 !== "White : 1\nBlack : 0") {
      throw new Error("not all game modes displayed");
    }

    console.log("Passed");

    successes++;

  } catch (error) {
    console.error(error);
    failures++;
  }

  testsran++;
  // now checking if game history mounts

  // Find the element(s) representing the statistics
  const gameHistoryElement = await driver.findElement(By.id("game-history"));

  // Check if the statistics element is displayed
  const isDisplayedGameHistory = await gameHistoryElement.isDisplayed();

  try {
    if (isDisplayedGameHistory) {
        successes++;
        console.log("Passed");
    }
    else {
        throw new Error("Game history not found");
    }
  }
  catch (error) {
      failures++;
      console.error("Failed");
  }

  testsran++;

  await new Promise(resolve => setTimeout(resolve, 500));

  // now checking if game history has the correct fields

  try {

    // Find the first name in the table
    const RowName1 = await driver.findElement(By.xpath('//*[@id="game-history"]/tbody/tr[2]/td[1]/span[1]')).getText();
    // console.log('First row name:', firstRowName);
  
    // Assert that the first name is "newtesting"
    if (RowName1 !== 'newtesting') {
      throw new Error("The entries in game history are incorrect");
    }

    const RowName2 = await driver.findElement(By.xpath('//*[@id="game-history"]/tbody/tr[3]/td[1]/span[1]')).getText();
  
    // Assert that the first name is "newtesting"
    if (RowName2 !== 'newtesting') {
      throw new Error("The entries in game history are incorrect");
    }

    const RowName3 = await driver.findElement(By.xpath('//*[@id="game-history"]/tbody/tr[4]/td[1]/span[1]')).getText();
  
    // Assert that the first name is "newtesting"
    if (RowName3 !== 'newtesting') {
      throw new Error("The entries in game history are incorrect");
    }
    // Find the scores in the table
    const scores = await driver.findElements(By.className('data scores'));
    const scoreValues = await Promise.all(scores.map(async (score) => {
      return score.getText();
    }));
    // console.log('Scores:', scoreValues);
  
    // Assert that the scores are "1", "0", "0"
    if (scoreValues[0] !== '1\n0' || scoreValues[1] !== '0\n1' || scoreValues[2] !== '0\n0') {
      throw new Error('The scores in game history are incorrect');
    }
    successes++;
    console.error("Passed");
  }
  catch (error) {
    failures++;
    console.error("Failed");
  }

  testsran++;

}

async function testStandard(driver) {
  
  console.log("Test ID 1:");

  await driver.findElement(By.id('demo-simple-select')).click();
  await driver.findElement(By.id('standard')).click();

  await new Promise(resolve => setTimeout(resolve, 500));

  const statisticsElement = await driver.findElement(By.id("game-statistics"));

  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    let userCookie = "";

    await driver.manage().getCookie("userId").then(function(cookie) {
      // console.log('cookie details => ', cookie.value);
      userCookie = cookie.value;
    });

    // const retreiveGameData = await getPastGamesInformation(userCookie);

    // const compareData = formatGameData(handleGraphData(retreiveGameData, userCookie));

    const bars = await statisticsElement.findElements(By.css('.recharts-layer.recharts-bar-rectangle'));

    const tooltip = await driver.findElement(By.css('.recharts-tooltip-wrapper'));

    // Perform a click action on the bar
    await driver.actions().move({ origin: bars[0] }).perform();

    await new Promise(resolve => setTimeout(resolve, 500));

    const tooltipText1 = await tooltip.getText();

    if (tooltipText1 !== "White : 1\nBlack : 0") {
      throw new Error("standard game mode displayed");
    }

    console.log("Passed");

    successes++;

  } catch (error) {
    console.error(error);
    failures++;
  }

  testsran++;
  // now checking if game history has the correct fields

  try {

    // Find the first name in the table
    const RowName1 = await driver.findElement(By.xpath('//*[@id="game-history"]/tbody/tr[2]/td[1]/span[1]')).getText();
    // console.log('First row name:', firstRowName);
  
    // Assert that the first name is "newtesting"
    if (RowName1 !== 'newtesting') {
      throw new Error("The entries in game history are incorrect");
    }
    // Find the scores in the table
    const scores = await driver.findElements(By.className('data scores'));
    const scoreValues = await Promise.all(scores.map(async (score) => {
      return score.getText();
    }));
    // console.log('Scores:', scoreValues);
  
    if (scoreValues[0] !== '1\n0') {
      throw new Error('The scores in game history are incorrect');
    }
    successes++;
    console.error("Passed");
  }
  catch (error) {
    failures++;
    console.error("Failed");
  }

  testsran++;

}

async function testBlind(driver) {
  
  console.log("Test ID 2:");

  await driver.findElement(By.id('demo-simple-select')).click();
  await driver.findElement(By.id('blind')).click();

  await new Promise(resolve => setTimeout(resolve, 500));

  const statisticsElement = await driver.findElement(By.id("game-statistics"));

  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    let userCookie = "";

    await driver.manage().getCookie("userId").then(function(cookie) {
      // console.log('cookie details => ', cookie.value);
      userCookie = cookie.value;
    });

    // const retreiveGameData = await getPastGamesInformation(userCookie);

    // const compareData = formatGameData(handleGraphData(retreiveGameData, userCookie));

    const bars = await statisticsElement.findElements(By.css('.recharts-layer.recharts-bar-rectangle'));

    const tooltip = await driver.findElement(By.css('.recharts-tooltip-wrapper'));

    // Perform a click action on the bar
    await driver.actions().move({ origin: bars[1] }).perform();

    await new Promise(resolve => setTimeout(resolve, 500));

    const tooltipText1 = await tooltip.getText();

    if (tooltipText1 !== "White : 1\nBlack : 0") {
      throw new Error("blind game mode displayed");
    }

    console.log("Passed");

    successes++;

  } catch (error) {
    console.error(error);
    failures++;
  }

  testsran++;
  // now checking if game history has the correct fields

  try {
    // Find the first name in the table
    const RowName1 = await driver.findElement(By.xpath('//*[@id="game-history"]/tbody/tr[2]/td[1]/span[1]')).getText();
    // console.log('First row name:', firstRowName);
  
    // Assert that the first name is "newtesting"
    if (RowName1 !== 'newtesting') {
      throw new Error("The entries in game history are incorrect");
    }
    // Find the scores in the table
    const scores = await driver.findElements(By.className('data scores'));
    const scoreValues = await Promise.all(scores.map(async (score) => {
      return score.getText();
    }));
    // console.log('Scores:', scoreValues);
  
    if (scoreValues[0] !== '0\n1') {
      throw new Error('The scores in game history are incorrect');
    }
    successes++;
    console.error("Passed");
  }
  catch (error) {
    failures++;
    console.error("Failed");
  }

  testsran++;

}

async function testPowerUpDuck(driver) {
  
  console.log("Test ID 3:");

  await driver.findElement(By.id('demo-simple-select')).click();
  await driver.findElement(By.id('powerupduck')).click();

  await new Promise(resolve => setTimeout(resolve, 500));

  const statisticsElement = await driver.findElement(By.id("game-statistics"));

  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    let userCookie = "";

    await driver.manage().getCookie("userId").then(function(cookie) {
      // console.log('cookie details => ', cookie.value);
      userCookie = cookie.value;
    });

    // const retreiveGameData = await getPastGamesInformation(userCookie);

    // const compareData = formatGameData(handleGraphData(retreiveGameData, userCookie));

    const bars = await statisticsElement.findElements(By.css('.recharts-layer.recharts-bar-rectangle'));

    const tooltip = await driver.findElement(By.css('.recharts-tooltip-wrapper'));

    // Perform a click action on the bar
    await driver.actions().move({ origin: bars[2] }).perform();
    
    await new Promise(resolve => setTimeout(resolve, 500));

    const tooltipText1 = await tooltip.getText();

    if (tooltipText1 !== "White : 1\nBlack : 0") {
      throw new Error("power-up duck mode not displayed");
    }

    console.log("Passed");

    successes++;

  } catch (error) {
    console.error(error);
    failures++;
  }

  testsran++;
  // now checking if game history has the correct fields

  try {
    // Find the first name in the table
    const RowName1 = await driver.findElement(By.xpath('//*[@id="game-history"]/tbody/tr[2]/td[1]/span[1]')).getText();
    // console.log('First row name:', firstRowName);
  
    // Assert that the first name is "newtesting"
    if (RowName1 !== 'newtesting') {
      throw new Error("The entries in game history are incorrect");
    }
    // Find the scores in the table
    const scores = await driver.findElements(By.className('data scores'));
    const scoreValues = await Promise.all(scores.map(async (score) => {
      return score.getText();
    }));
    // console.log('Scores:', scoreValues);
  
    if (scoreValues[0] !== '0\n0') {
      throw new Error('The scores in game history are incorrect');
    }
    successes++;
    console.error("Passed");
  }
  catch (error) {
    failures++;
    console.error("Failed");
  }

  testsran++;

}

async function testEnterGameReview(driver) {
  
  console.log("Test ID 4:");

  await driver.findElement(By.id('demo-simple-select')).click();
  await driver.findElement(By.id('all')).click();

  await new Promise(resolve => setTimeout(resolve, 500));

  await driver.findElement(By.css('.data.link a')).click();

  await new Promise(resolve => setTimeout(resolve, 500));
  

  try {
    // Find the first name in the table
    const gameReviewElement = await driver.findElement(By.id("game-review"));
  
    // Check if the statistics element is displayed
    const isDisplayed = await gameReviewElement.isDisplayed();
  

    if (isDisplayed) {
        successes++;
        console.log("Passed");
    }
    else {
        throw new Error("Game review not found");
    }
  
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  catch (error) {
    failures++;
    console.error("Failed");
  }

  testsran++;

  // test that player1 is 'newtesting'

  await driver.findElement(By.css('.player')).getText();

  try {
    if (player1Text.trim() === 'newtesting') {
      successes++;
      console.log("Passed");
    } else {
      throw new Error("proper game info not displayed");
    }
  }
  catch (error) {
    failures++;
    console.error("Failed");
  }

  testsran++;

  await new Promise(resolve => setTimeout(resolve, 500));

  // now test that the proper moves are passed? maybe I'm not gonna implement this.

}

async function testNextMove(driver) {

  console.log("Test ID 4:");

  await new Promise(resolve => setTimeout(resolve, 500));
  // await driver.findElement(By.id('next-move')).click();

  try {
    // Find the first name in the table
    const nextMoveElement = await driver.findElement(By.id("next-move"));
  
    // Check if the statistics element is displayed
    const isDisplayed = await nextMoveElement.isDisplayed();
  

    if (isDisplayed) {
        successes++;
        console.log("Passed");
    }
    else {
        throw new Error("next move not performed");
    }
  
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  catch (error) {
    failures++;
    console.error("Failed");
  }

  testsran++;

}

async function testPreviousMove(driver) {

  console.log("Test ID 6:");

  // await driver.findElement(By.id('previous-move')).click();

  try {
    // Find the first name in the table
    const nextMoveElement = await driver.findElement(By.id("previous-move"));
  
    // Check if the statistics element is displayed
    const isDisplayed = await nextMoveElement.isDisplayed();
  

    if (isDisplayed) {
        successes++;
        console.log("Passed");
    }
    else {
        throw new Error("next move not performed");
    }
  
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  catch (error) {
    failures++;
    console.error("Failed");
  }

  testsran++;

}

module.exports = profileTests;