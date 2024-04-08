const clientConfig = require("./clientConfig");
const {fetchUser} = require("./fetchUser");
const bcrypt = require("bcryptjs");
const { Builder, By, Key, until, Actions } = require('selenium-webdriver');

async function authenticationTests() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {

    // connect to client URL
    await driver.get(clientConfig.CLIENT_URL);

    
    console.log("-----TEST SUITE 1: AUTHENTICATION-----");

    console.log("----REGISTER----");

    console.log("Testing Criteria 1: Check if system properly handles no input:");

    await testNoInput(driver);

    console.log("Testing Criteria 2: Check if system handles improper email format:");

    await testIncorrectEmailFormat(driver);

    console.log("Testing Criteria 3: Check if system stores user info into the database:");

    await testCorrectRegistration(driver);

    console.log("Testing Criteria 4: Check if system can handle duplicates:");

    await testDuplicates(driver);

    console.log("BOUNDARY CONDITIONS: Check if system can handle size of given username and password:");

    console.log("(not implemented since idk if we are going to)");

    console.log("----LOGIN----");

    console.log("Testing Criteria 6: Check if system properly handles no input:");

    await testNoInputLogin(driver);

    console.log("Testing Criteria 7: Check if system handles user not found in database:");

    await testUserNotFound(driver);

    console.log("Testing Criteria 8: Check if the system handles incorrect password:");

    await testIncorrectPassword(driver);

    console.log("Testing Criteria 9, 10 and 11: Check if system logs in with username or email, and that it successfully stores cookie:");

    // storing cookies not done yet because it doesn't work for some reason
    await testLogin(driver);

    console.log("----CHANGE PASSWORD----");

    console.log("Testing Criteria 12: Check if system properly handles no input:");

    await testChangePasswordNoInput(driver);

    console.log("Testing Criteria 13: Check if system handles incorrect password:");

    await testChangePasswordIncorrect(driver);

    console.log("Testing Criteria 14: Check if the system successfully changes to new password:");

    await testChangePassword(driver);

    console.log("----CHANGE USERNAME----");

    console.log("Testing Criteria 15: Check if system properly handles no input:");

    await testChangeUsernameNoInput(driver);

    console.log("Testing Criteria 16: Check if system handles incorrect password:");

    await testChangeUsernameIncorrect(driver);

    console.log("Testing Criteria 17: Check if the system successfully changes to new username:");

    await testChangeUsername(driver);


  } finally {
    await driver.quit();
  }
}

async function testNoInput(driver) {

    // console.log("Waiting for 10 seconds...");
    // await new Promise(resolve => setTimeout(resolve, 10000));

    console.log("Test ID 0:");

    await driver.findElement(By.id('signup')).click();

    await driver.findElement(By.id('password')).sendKeys('password');
    await driver.findElement(By.id('email')).sendKeys('testing@testing.com');
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Verify error message for required fields
    const activeElement1 = await driver.switchTo().activeElement();
    const messageStr1 = await activeElement1.getAttribute("validationMessage");

    try {
        if (messageStr1 === 'Please fill out this field.') {
            console.log("Passed");
        }
        else {
            throw new Error("Error message does not display");
        }
    }
    catch (error) {
        console.error("Failed");
    }

    // clearing textfield entries:
    await driver.findElement(By.id('password')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('password')).sendKeys(Key.DELETE);
    await driver.findElement(By.id('email')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('email')).sendKeys(Key.DELETE);

    console.log("Test ID 1:");

    await driver.findElement(By.id('username')).sendKeys('testing');
    await driver.findElement(By.id('email')).sendKeys('testing@testing.com');


    await driver.findElement(By.css('button[type="submit"]')).click();

    // Verify error message for required fields
    const activeElement2 = await driver.switchTo().activeElement();
    const messageStr2 = await activeElement2.getAttribute("validationMessage");

    try {
        if (messageStr2 === 'Please fill out this field.') {
            console.log("Passed");
        } 
        else {
            throw new Error("Error message does not display");
        }
    }
    catch (error) {
        console.error("Failed");
    }


    await driver.findElement(By.id('username')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('username')).sendKeys(Key.DELETE);
    await driver.findElement(By.id('email')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('email')).sendKeys(Key.DELETE);


    console.log("Test ID 2:");

    await driver.findElement(By.id('username')).sendKeys('testing');
    await driver.findElement(By.id('password')).sendKeys('password');
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Verify error message for required fields
    const activeElement3 = await driver.switchTo().activeElement();
    const messageStr3 = await activeElement3.getAttribute("validationMessage");

    try {
        if (messageStr3 === 'Please fill out this field.') {
            console.log("Passed");
        } else {
            throw new Error("Error message does not display");
        }
    }
    catch (error) {
        console.error("Failed");
    }

    await driver.findElement(By.id('username')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('username')).sendKeys(Key.DELETE);
    await driver.findElement(By.id('password')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('password')).sendKeys(Key.DELETE);
}

async function testIncorrectEmailFormat(driver) {

    // console.log("Waiting for 10 seconds...");
    // await new Promise(resolve => setTimeout(resolve, 10000));

    console.log("Test ID 3:");

    
    await driver.findElement(By.id('username')).sendKeys('testing');
    await driver.findElement(By.id('password')).sendKeys('password');
    await driver.findElement(By.id('email')).sendKeys('testingtesting.com');
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Verify error message for required fields
    const activeElement1 = await driver.switchTo().activeElement();
    const messageStr1 = await activeElement1.getAttribute("validationMessage");

    try {
        if (messageStr1 === "Please include an '@' in the email address. 'testingtesting.com' is missing an '@'.") {
            console.log("Passed");
        } else {
            throw new Error("Error message does not display");
        }
    }
    catch (error) {
        console.error("Failed");
    }

    await driver.findElement(By.id('username')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('username')).sendKeys(Key.DELETE);
    await driver.findElement(By.id('password')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('password')).sendKeys(Key.DELETE);
    await driver.findElement(By.id('email')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('email')).sendKeys(Key.DELETE);
}

async function testCorrectRegistration(driver) {
    
    // console.log("Waiting for 10 seconds...");
    // await new Promise(resolve => setTimeout(resolve, 10000));

    console.log("Test ID 4:");

    await driver.findElement(By.id('username')).sendKeys('testing');
    await driver.findElement(By.id('password')).sendKeys('password');
    await driver.findElement(By.id('email')).sendKeys('testing@testing.com');
    await driver.findElement(By.css('button[type="submit"]')).click();


    await new Promise(resolve => setTimeout(resolve, 500)); // wait for user to be registered

    const isUserRegistered = await fetchUser("testing");

    // Verify if the user is registered
    try {
        if (isUserRegistered) {
            // console.log("User is registered: " + JSON.stringify(isUserRegistered));
            console.log("Passed");
            // Add further verification steps if needed
        } else {
            throw new Error("User not registered");
        }
    } catch (error) {
        console.error("Failed");
        // Handle failure scenario if needed
    }    
}

async function testDuplicates(driver) {

    console.log("Test ID 5:");

    await driver.findElement(By.id('signup')).click();

    await driver.findElement(By.id('username')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('username')).sendKeys(Key.DELETE);
    await driver.findElement(By.id('password')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('password')).sendKeys(Key.DELETE);
    await driver.findElement(By.id('email')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('email')).sendKeys(Key.DELETE);
    await driver.findElement(By.id('username')).sendKeys('testing');
    await driver.findElement(By.id('password')).sendKeys('password');
    await driver.findElement(By.id('email')).sendKeys('testing@testing.com');
    await driver.findElement(By.css('button[type="submit"]')).click();

    // check if the error displays in the modal
    await new Promise(resolve => setTimeout(resolve, 100)); // wait for errorbox to display
    const errorMessageElement = await driver.findElement(By.id("error-box"));
    const isErrorMessageDisplayed = await errorMessageElement.isDisplayed();

    try {

        if (isErrorMessageDisplayed) {
            console.log("Passed");
        } else {
            throw new Error("Error message not displayed");
        }
    } catch (error) {
        console.error("Failed");
    }
}

async function testBoundaryConditions(driver) {
  // Implement test case
}

async function testNoInputLogin(driver) {

    // console.log("Waiting for 10 seconds...");
    // await new Promise(resolve => setTimeout(resolve, 10000));

    console.log("Test ID #:");

    await driver.actions().move({ x: 100, y: 100 }).click().perform();

    await driver.findElement(By.id('signin')).click();

    await driver.findElement(By.id('password')).sendKeys('password');
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Verify error message for required fields
    const activeElement1 = await driver.switchTo().activeElement();
    const messageStr1 = await activeElement1.getAttribute("validationMessage");

    try {
        if (messageStr1 === 'Please fill out this field.') {
            console.log("Passed");
        }
        else {
            throw new Error("Error message does not display");
        }
    }
    catch (error) {
        console.error("Failed");
    }

    // clearing textfield entries:
    await driver.findElement(By.id('password')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('password')).sendKeys(Key.DELETE);

    console.log("Test ID #:");

    await driver.findElement(By.id('identity')).sendKeys('testing');
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Verify error message for required fields
    const activeElement2 = await driver.switchTo().activeElement();
    const messageStr2 = await activeElement2.getAttribute("validationMessage");

    try {
        if (messageStr2 === 'Please fill out this field.') {
            console.log("Passed");
        } 
        else {
            throw new Error("Error message does not display");
        }
    }
    catch (error) {
        console.error("Failed");
    }

    await driver.findElement(By.id('identity')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('identity')).sendKeys(Key.DELETE);
}

async function testUserNotFound(driver) {

    // console.log("Waiting for 10 seconds...");
    // await new Promise(resolve => setTimeout(resolve, 10000));

    console.log("Test ID #:");

    await driver.findElement(By.id('identity')).sendKeys('badtesting');
    await driver.findElement(By.id('password')).sendKeys('password');
    await driver.findElement(By.css('button[type="submit"]')).click();

    // check if the error displays in the modal
    await new Promise(resolve => setTimeout(resolve, 100)); // wait for errorbox to display
    const errorMessageElement = await driver.findElement(By.id("error-box"));
    const isErrorMessageDisplayed = await errorMessageElement.isDisplayed();

    try {
        if (isErrorMessageDisplayed) {
            console.log("Passed");
        } else {
            throw new Error("Error message not displayed");
        }
    } catch (error) {
        console.error("Failed");
    }

    await driver.findElement(By.id('identity')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('identity')).sendKeys(Key.DELETE);
    await driver.findElement(By.id('password')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('password')).sendKeys(Key.DELETE);
}

async function testIncorrectPassword(driver) {

    // console.log("Waiting for 10 seconds...");
    // await new Promise(resolve => setTimeout(resolve, 10000));

    console.log("Test ID #:");

    await driver.findElement(By.id('identity')).sendKeys('testing');
    await driver.findElement(By.id('password')).sendKeys('wrongpassword');
    await driver.findElement(By.css('button[type="submit"]')).click();

    // check if the error displays in the modal
    await new Promise(resolve => setTimeout(resolve, 500)); // wait for errorbox to display
    const errorMessageElement = await driver.findElement(By.id("error-box"));
    const isErrorMessageDisplayed = await errorMessageElement.isDisplayed();

    try {
        if (isErrorMessageDisplayed) {
            console.log("Passed");
        } else {
            throw new Error("Error message not displayed");
        }
    } catch (error) {
        console.error("Failed");
    }

    await driver.findElement(By.id('identity')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('identity')).sendKeys(Key.DELETE);
    await driver.findElement(By.id('password')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('password')).sendKeys(Key.DELETE);
}

async function testLogin(driver) {
    // console.log("Waiting for 10 seconds...");
    // await new Promise(resolve => setTimeout(resolve, 10000));

    console.log("Test ID #:");

    await driver.findElement(By.id('identity')).sendKeys('testing');
    await driver.findElement(By.id('password')).sendKeys('password');
    await driver.findElement(By.css('button[type="submit"]')).click();

    await new Promise(resolve => setTimeout(resolve, 500));

    const accountIcon = await driver.findElements(By.id('account-icon'));

    try {
        // Check if the element exists
        if (accountIcon.length > 0) {
        console.log('Passed');
        } else {
        throw new Error('Failed');
        }
    } catch (error) {
        console.error("Failed");
    }

    await driver.findElement(By.id("account-icon")).click();
    await driver.findElement(By.xpath('//li[text()="Logout"]')).click();

    console.log("Test ID #:");

    await driver.findElement(By.id('signin')).click();
    await driver.findElement(By.id('identity')).sendKeys('testing@testing.com');
    await driver.findElement(By.id('password')).sendKeys('password');
    await driver.findElement(By.css('button[type="submit"]')).click();

    await new Promise(resolve => setTimeout(resolve, 500));

    const accountIcon2 = await driver.findElements(By.id('account-icon'));

    try {
        // Check if the element exists
        if (accountIcon2.length > 0) {
        console.log('Passed');
        } else {
        throw new Error('Failed');
        }
    } catch (error) {
        console.error("Failed");
    }
}

async function testChangePasswordNoInput(driver) {
    // console.log("Waiting for 10 seconds...");
    // await new Promise(resolve => setTimeout(resolve, 10000));

    console.log("Test ID #:");

    await driver.findElement(By.id("account-icon")).click();
    await driver.findElement(By.xpath('//li[text()="Profile"]')).click();
    await driver.findElement(By.id('change-password')).click();
    await driver.findElement(By.id('newPassword')).sendKeys('newpassword');
    await driver.findElement(By.css('button[type="submit"]')).click();

    // check if the error displays in the modal
    const activeElement1 = await driver.switchTo().activeElement();
    const messageStr1 = await activeElement1.getAttribute("validationMessage");

    try {
        if (messageStr1 === 'Please fill out this field.') {
            console.log("Passed");
        } 
        else {
            throw new Error("Error message does not display");
        }
    }
    catch (error) {
        console.error("Failed");
    }

    await driver.findElement(By.id('newPassword')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('newPassword')).sendKeys(Key.DELETE);

    console.log("Test ID #:");

    await driver.findElement(By.id('oldPassword')).sendKeys('password');
    await driver.findElement(By.css('button[type="submit"]')).click();
    // check if the error displays in the modal
    const activeElement2 = await driver.switchTo().activeElement();
    const messageStr2 = await activeElement2.getAttribute("validationMessage");

    try {
        if (messageStr2 === 'Please fill out this field.') {
            console.log("Passed");
        } 
        else {
            throw new Error("Error message does not display");
        }
    }
    catch (error) {
        console.error("Failed");
    }

    await driver.findElement(By.id('oldPassword')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('oldPassword')).sendKeys(Key.DELETE);
}

async function testChangePasswordIncorrect(driver) {
    // console.log("Waiting for 10 seconds...");
    // await new Promise(resolve => setTimeout(resolve, 10000));

    console.log("Test ID #:");

    await driver.findElement(By.id('oldPassword')).sendKeys('wrongpassword');
    await driver.findElement(By.id('newPassword')).sendKeys('newpassword');
    await driver.findElement(By.css('button[type="submit"]')).click();

    await new Promise(resolve => setTimeout(resolve, 500)); // wait for errorbox to display
    const errorMessageElement1 = await driver.findElement(By.id("error-box"));
    const isErrorMessageDisplayed1 = await errorMessageElement1.isDisplayed();

    try {
        if (isErrorMessageDisplayed1) {
            console.log("Passed");
        } else {
            throw new Error("Error message not displayed");
        }
    } catch (error) {
        console.error("Failed");
    }

    await driver.findElement(By.id('oldPassword')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('oldPassword')).sendKeys(Key.DELETE);
    await driver.findElement(By.id('newPassword')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('newPassword')).sendKeys(Key.DELETE);
}

async function testChangePassword(driver) {
    // console.log("Waiting for 10 seconds...");
    // await new Promise(resolve => setTimeout(resolve, 10000));

    console.log("Test ID #:");

    await driver.findElement(By.id('oldPassword')).sendKeys('password');
    await driver.findElement(By.id('newPassword')).sendKeys('newpassword');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = await fetchUser("testing");

    try {
        if (bcrypt.compareSync("newpassword", user.password)) {
            // If old password mtaches
            console.log("Passed");
        }
        else {
            throw new Error("password was not updated");
        }
    } catch (error) {
        console.error("Failed");
    } 
}

async function testChangeUsernameNoInput(driver) {
    // console.log("Waiting for 10 seconds...");
    // await new Promise(resolve => setTimeout(resolve, 10000));

    console.log("Test ID #:");

    await driver.findElement(By.id('change-username')).click();
    await driver.findElement(By.id('password')).sendKeys('newpassword');
    await driver.findElement(By.css('button[type="submit"]')).click();

    // check if the error displays in the modal
    const activeElement1 = await driver.switchTo().activeElement();
    const messageStr1 = await activeElement1.getAttribute("validationMessage");

    try {
        if (messageStr1 === 'Please fill out this field.') {
            console.log("Passed");
        } 
        else {
            throw new Error("Error message does not display");
        }
    }
    catch (error) {
        console.error("Failed");
    }

    await driver.findElement(By.id('password')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('password')).sendKeys(Key.DELETE);

    console.log("Test ID #:");

    await driver.findElement(By.id('newUsername')).sendKeys('newtesting');
    await driver.findElement(By.css('button[type="submit"]')).click();
    // check if the error displays in the modal
    const activeElement2 = await driver.switchTo().activeElement();
    const messageStr2 = await activeElement2.getAttribute("validationMessage");

    try {
        if (messageStr2 === 'Please fill out this field.') {
            console.log("Passed");
        } 
        else {
            throw new Error("Error message does not display");
        }
    }
    catch (error) {
        console.error("Failed");
    }

    await driver.findElement(By.id('newUsername')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('newUsername')).sendKeys(Key.DELETE);
}

async function testChangeUsernameIncorrect(driver) {
    // console.log("Waiting for 10 seconds...");
    // await new Promise(resolve => setTimeout(resolve, 10000));

    console.log("Test ID #:");

    await driver.findElement(By.id('newUsername')).sendKeys('newtesting');
    await driver.findElement(By.id('password')).sendKeys('wrongpassword');
    await driver.findElement(By.css('button[type="submit"]')).click();

    await new Promise(resolve => setTimeout(resolve, 500)); // wait for errorbox to display
    const errorMessageElement1 = await driver.findElement(By.id("error-box"));
    const isErrorMessageDisplayed1 = await errorMessageElement1.isDisplayed();

    try {
        if (isErrorMessageDisplayed1) {
            console.log("Passed");
        } else {
            throw new Error("Error message not displayed");
        }
    } catch (error) {
        console.error("Failed");
    }

    await driver.findElement(By.id('newUsername')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('newUsername')).sendKeys(Key.DELETE);
    await driver.findElement(By.id('password')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('password')).sendKeys(Key.DELETE);
}

async function testChangeUsername(driver) {
    // console.log("Waiting for 10 seconds...");
    // await new Promise(resolve => setTimeout(resolve, 10000));

    console.log("Test ID #:");

    await driver.findElement(By.id('newUsername')).sendKeys('newtesting');
    await driver.findElement(By.id('password')).sendKeys('newpassword');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await new Promise(resolve => setTimeout(resolve, 100)); // wait for user to change username in database

    const user = await fetchUser("newtesting");

    // Verify username changed
    try {
        if (user) {
            // console.log("User is registered: " + JSON.stringify(isUserRegistered));
            console.log("Passed");
        } else {
            throw new Error("User not registered");
        }
    } catch (error) {
        console.error("Failed");

    }   
}

authenticationTests();