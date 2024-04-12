const clientConfig = require("./clientConfig.js"); // Make sure to keep the extension as .js
const { getPastGamesInformation } = require("./pastGames.js"); // Make sure to keep the extension as .js
const bcrypt = require("bcryptjs");
const { Builder, By, Key, until, Actions, Select } = require('selenium-webdriver');
const { handleCreateGame, findPrivateGame } = require("./gameUtils.js"); // Make sure to keep the extension as .js
const io = require("socket.io-client");


let failures = 0;
let successes = 0;
let testsran = 0;

const parseCookie = (cookie) => {
    return cookie.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.split("=");
      acc[key.trim()] = value;
      return acc;
    }, {});
};

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

        // await TestTimeUp(PlayerA, PlayerB);

        console.log("Testing Criteria 10: Test that H2H properly displays the game results:");

        // await TestH2H(PlayerA, PlayerB);

        console.log("Testing Criteria 18: Check that forfeiting ends the match in a loss for the player, and a win for the opponent:");

        await TestForfeit(PlayerA, PlayerB);

        console.log("Testing Criteria 15 and 16: Check that a reuqest to draw is sent to opposing player, and a rejection proceeds the match as usual:");

        await TestDrawReject(PlayerA, PlayerB);

        console.log("Testing Criteria 17: Check that accepting a draw request works:");

        await TestDrawAccept(PlayerA, PlayerB);

        console.log("Testing Pieces Move: Now checking the moves of pieces:");

        await TestPieces(PlayerA, PlayerB);
    
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

    await PlayerA.findElement(By.id('create-game')).click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await PlayerA.findElement(By.id('standard-select')).click();
    await new Promise(resolve => setTimeout(resolve, 1000));
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

    // console.log("Test ID 1:");

    // await new Promise(resolve => setTimeout(resolve, 61000));

    // try {
    //     const PlayerAResult = await PlayerA.findElement(By.id('game-result'));
    //     const PlayerBResult = await PlayerB.findElement(By.id('game-result'));

    //     const PlayerAText = await PlayerAResult.getText();
    //     console.log('Game Result:', PlayerAText);
    //     const PlayerBText = await PlayerBResult.getText();

    //     // Check if the dialog container is displayed
        
    //     if (PlayerAText !== "You lost!" || PlayerBText !== "You won!") {
    //         throw new Error("Game did not make Player A lose.");
    //     }
    //     console.log("Passed");
    //     successes++;
    // }
    // catch (error) {
    //     failures++;
    //     console.error("Failed:" + error);
    // }
    // testsran++;

    // getPastGamesInformation(playerACookie)

    // // Test that game is stored into database
    // // maybe have it so that I can retreive the game info from dastabase with given game ID??

}

async function TestH2H(PlayerA, PlayerB) {

    // console.log("Test ID 1:");


    // try {
    //     const PlayerAResult = await PlayerA.findElement(By.id('game-result'));
    //     const PlayerBResult = await PlayerB.findElement(By.id('game-result'));

    //     const PlayerAText = await PlayerAResult.getText();
    //     console.log('Game Result:', PlayerAText);
    //     const PlayerBText = await PlayerBResult.getText();

    //     // Check if the dialog container is displayed
        
    //     if (PlayerAText !== "You lost!" || PlayerBText !== "You won!") {
    //         throw new Error("Game did not make Player A lose.");
    //     }
    //     console.log("Passed");
    //     successes++;
    // }
    // catch (error) {
    //     failures++;
    //     console.error("Failed:" + error);
    // }
    // testsran++;

    // getPastGamesInformation(playerACookie)

    // // Test that game is stored into database
    // // maybe have it so that I can retreive the game info from dastabase with given game ID??

}

async function TestForfeit(PlayerA, PlayerB) {

    console.log("Test ID 3:");

    await PlayerA.findElement(By.id('resign-button')).click();
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        const PlayerAResult = await PlayerA.findElement(By.id('game-result'));
        const PlayerBResult = await PlayerB.findElement(By.id('game-result'));

        const PlayerAText = await PlayerAResult.getText();
        // console.log('Game Result:', PlayerAText);
        const PlayerBText = await PlayerBResult.getText();

        // Check if the dialog container is displayed
        
        if (PlayerAText !== "You lost!" || PlayerBText !== "You won!") {
            throw new Error("Player A did not forfeit properly.");
        }
        console.log("Passed");
        successes++;
    }
    catch (error) {
        failures++;
        console.error("Failed:" + error);
    }
    testsran++;

    await PlayerA.quit();
    await PlayerB.quit();
}

async function TestDrawReject(PlayerA, PlayerB) {

    PlayerA = await new Builder().forBrowser('chrome').build();
    await PlayerA.get(clientConfig.CLIENT_URL);
    PlayerB = await new Builder().forBrowser('chrome').build();
    await PlayerB.get(clientConfig.CLIENT_URL);

    await PlayerA.findElement(By.id('signin')).click();

    await PlayerA.findElement(By.id('identity')).sendKeys('PlayerA');
    await PlayerA.findElement(By.id('password')).sendKeys('playera');
    await PlayerA.findElement(By.css('button[type="submit"]')).click();

    await PlayerB.findElement(By.id('signin')).click();

    await PlayerB.findElement(By.id('identity')).sendKeys('PlayerB');
    await PlayerB.findElement(By.id('password')).sendKeys('playerb');
    await PlayerB.findElement(By.css('button[type="submit"]')).click();

    await PlayerA.findElement(By.id('create-game')).click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await PlayerA.findElement(By.id('standard-select')).click();
    await new Promise(resolve => setTimeout(resolve, 1000));
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

    console.log("Test ID 4:");

    // now testing draw
    await PlayerA.findElement(By.id('draw-button')).click();
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        const drawDialog = await PlayerB.findElement(By.id('draw-dialog'));

        // Check if the dialog container is displayed
        const isDisplayed = await drawDialog.isDisplayed();
        
        if (!isDisplayed) {
            throw new Error("Draw was not found from PlayerB");
        }
        console.log("Passed");
        successes++;
    }
    catch (error) {
        failures++;
        console.error("Failed");
    }

    testsran++;

    await PlayerB.findElement(By.id('select-no')).click();
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        const boardContainer = await PlayerA.findElement(By.id('game-board'));

        // Check if the dialog container is displayed
        const isDisplayed = await boardContainer.isDisplayed();
        
        if (!isDisplayed) {
            throw new Error("Draw was not rejected properly");
        }
        console.log("Passed");
        successes++;
    }
    catch (error) {
        failures++;
        console.error("Failed");
    }
    testsran++;

    await new Promise(resolve => setTimeout(resolve, 1000));
    await PlayerA.findElement(By.id('resign-button')).click();
    await new Promise(resolve => setTimeout(resolve, 1000));

    await PlayerA.quit();
    await PlayerB.quit();
}

async function TestDrawAccept(PlayerA, PlayerB) {

    PlayerA = await new Builder().forBrowser('chrome').build();
    await PlayerA.get(clientConfig.CLIENT_URL);
    PlayerB = await new Builder().forBrowser('chrome').build();
    await PlayerB.get(clientConfig.CLIENT_URL);

    await PlayerA.findElement(By.id('signin')).click();

    await PlayerA.findElement(By.id('identity')).sendKeys('PlayerA');
    await PlayerA.findElement(By.id('password')).sendKeys('playera');
    await PlayerA.findElement(By.css('button[type="submit"]')).click();

    await PlayerB.findElement(By.id('signin')).click();

    await PlayerB.findElement(By.id('identity')).sendKeys('PlayerB');
    await PlayerB.findElement(By.id('password')).sendKeys('playerb');
    await PlayerB.findElement(By.css('button[type="submit"]')).click();

    await PlayerA.findElement(By.id('create-game')).click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await PlayerA.findElement(By.id('standard-select')).click();
    await new Promise(resolve => setTimeout(resolve, 1000));
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

    console.log("Test ID 5:");
    await new Promise(resolve => setTimeout(resolve, 500));
    // now testing draw accept
    await PlayerA.findElement(By.id('draw-button')).click();
    await new Promise(resolve => setTimeout(resolve, 500));
    await PlayerB.findElement(By.id('select-yes')).click();
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        const PlayerAResult = await PlayerA.findElement(By.id('game-result'));
        const PlayerBResult = await PlayerB.findElement(By.id('game-result'));

        const PlayerAText = await PlayerAResult.getText();
        // console.log('Game Result:', PlayerAText);
        const PlayerBText = await PlayerBResult.getText();

        // Check if the dialog container is displayed
        
        if (PlayerAText !== "Draw" || PlayerBText !== "Draw") {
            throw new Error("Draw was not accepted properly.");
        }
        console.log("Passed");
        successes++;
    }
    catch (error) {
        failures++;
        console.error("Failed:" + error);
    }
    testsran++;

    await PlayerA.quit();
    await PlayerB.quit();
}

async function TestPieces(PlayerA, PlayerB) {

    PlayerA = await new Builder().forBrowser('chrome').build();
    await PlayerA.get(clientConfig.CLIENT_URL);
    PlayerB = await new Builder().forBrowser('chrome').build();
    await PlayerB.get(clientConfig.CLIENT_URL);

    await PlayerA.findElement(By.id('signin')).click();

    await PlayerA.findElement(By.id('identity')).sendKeys('PlayerA');
    await PlayerA.findElement(By.id('password')).sendKeys('playera');
    await PlayerA.findElement(By.css('button[type="submit"]')).click();

    await PlayerB.findElement(By.id('signin')).click();

    await PlayerB.findElement(By.id('identity')).sendKeys('PlayerB');
    await PlayerB.findElement(By.id('password')).sendKeys('playerb');
    await PlayerB.findElement(By.css('button[type="submit"]')).click();

    await PlayerA.findElement(By.id('create-game')).click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await PlayerA.findElement(By.id('standard-select')).click();
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

    console.log("Test ID 6:");
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log("Check if pawn displays all legal moves: ");
    // now testing draw accept
    const squareSelector1 = `.board-row:nth-child(${7}) .board-square:nth-child(${5})`;
    await PlayerA.findElement(By.css(squareSelector1)).click();
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        // Check if legal moves are highlighted
        const squareHighlighted1 = `.board-row:nth-child(${6}) .board-square:nth-child(${5})`;
        const NSquareHighlighted1 = await PlayerA.findElement(By.css(squareHighlighted1));
        const NsSquareHighlighted1 = await NSquareHighlighted1.findElement(By.id("square-piece"));
        const isHighlighted1 = await NsSquareHighlighted1.getAttribute("ishighlighted")
        // console.log("IS HIGHLIGHTED??: " + isHighlighted1);

        const squareHighlighted2 = `.board-row:nth-child(${5}) .board-square:nth-child(${5})`;
        const NSquareHighlighted2 = await PlayerA.findElement(By.css(squareHighlighted2));
        const NsSquareHighlighted2 = await NSquareHighlighted2.findElement(By.id("square-piece"));
        const isHighlighted2 = await NsSquareHighlighted2.getAttribute("ishighlighted")

        if (isHighlighted1 === false || isHighlighted2 === false) {
            throw new Error("Legal moves for pawn not highlighted");
        }
        console.log("Passed");
        successes++;
    }
    catch (error) {
        failures++;
        console.error("Failed:" + error);
    }

    testsran++;

    console.log("Test ID 7:");
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log("Check that invalid moves are not allowed when clicking a square for pawn: ");

    const squareSelector2 = `.board-row:nth-child(${4}) .board-square:nth-child(${5})`;
    await PlayerA.findElement(By.css(squareSelector2)).click();
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        // Check that pawn is not at location
        const square1 = `.board-row:nth-child(${4}) .board-square:nth-child(${5})`;
        const NSquare1 = await PlayerA.findElement(By.css(square1));
        const NsSquare1 = await NSquare1.findElement(By.id("square-piece"));
        const noPiece = await NsSquare1.getAttribute("piece")

        if (noPiece !== null) {
            throw new Error("Illegal moves not accounted for.");
        }
        console.log("Passed");
        successes++;
    }
    catch (error) {
        failures++;
        console.error("Failed:" + error);
    }

    testsran++;

    console.log("Test ID 8:");
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log("Check if the piece moves to the selected square when legal moves are displayed. Check that valid moves are allowed with clicking a square: ");

    const squareSelector3 = `.board-row:nth-child(${7}) .board-square:nth-child(${5})`;
    await PlayerA.findElement(By.css(squareSelector3)).click();
    await new Promise(resolve => setTimeout(resolve, 500));

    const squareSelector4 = `.board-row:nth-child(${5}) .board-square:nth-child(${5})`;
    await PlayerA.findElement(By.css(squareSelector4)).click();
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        // Check that pawn is at location
        const square1 = `.board-row:nth-child(${5}) .board-square:nth-child(${5})`;
        const NSquare1 = await PlayerA.findElement(By.css(square1));
        const NsSquare1 = await NSquare1.findElement(By.id("square-piece"));
        const pawnPiece = await NsSquare1.getAttribute("piece")

        if (pawnPiece !== "p") {
            throw new Error("Pawn not at location.");
        }
        console.log("Passed");
        successes++;
    }
    catch (error) {
        failures++;
        console.error("Failed:" + error);
    }

    testsran++;

    await new Promise(resolve => setTimeout(resolve, 500));

    console.log("Test ID 9:");

    console.log("Testing that Undo sends properly, and that rejection works: ");

    await PlayerA.findElement(By.id('undo-button')).click();

    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        const undoDialog = await PlayerB.findElement(By.id('draw-dialog'));

        // Check if the dialog container is displayed
        const isDisplayed = await undoDialog.isDisplayed();
        
        if (!isDisplayed) {
            throw new Error("Undo was not found from PlayerB");
        }
        console.log("Passed");
        successes++;
    }
    catch (error) {
        failures++;
        console.error("Failed");
    }

    testsran++;

    await PlayerB.findElement(By.id('select-no')).click();
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        // Check that pawn is at location
        const square1 = `.board-row:nth-child(${5}) .board-square:nth-child(${5})`;
        const NSquare1 = await PlayerA.findElement(By.css(square1));
        const NsSquare1 = await NSquare1.findElement(By.id("square-piece"));
        const pawnPiece = await NsSquare1.getAttribute("piece")

        if (pawnPiece !== "p") {
            throw new Error("Rejection didn't work.");
        }
        console.log("Passed");
        successes++;
    }
    catch (error) {
        failures++;
        console.error("Failed:" + error);
    }
    testsran++;

    await new Promise(resolve => setTimeout(resolve, 500));

    console.log("Test ID 10:");

    console.log("Testing that undo accepting works: ");

    await PlayerA.findElement(By.id('undo-button')).click();

    await new Promise(resolve => setTimeout(resolve, 500));

    await PlayerB.findElement(By.id('select-yes')).click();

    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        // Check that pawn is at location
        const square1 = `.board-row:nth-child(${5}) .board-square:nth-child(${5})`;
        const NSquare1 = await PlayerA.findElement(By.css(square1));
        const NsSquare1 = await NSquare1.findElement(By.id("square-piece"));
        const pawnPiece = await NsSquare1.getAttribute("piece")

        if (pawnPiece !== null) {
            throw new Error("Undoing didn't work.");
        }
        console.log("Passed");
        successes++;
    }
    catch (error) {
        failures++;
        console.error("Failed:" + error);
    }
    testsran++;


    await PlayerA.findElement(By.id('resign-button')).click();
    await new Promise(resolve => setTimeout(resolve, 1000));

    await PlayerA.quit();
    await PlayerB.quit();
    

}

module.exports = beginGameTests;