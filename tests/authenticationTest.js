const clientConfig = require("./clientConfig");
const {fetchUser} = require("./fetchUser");
const bcrypt = require("bcryptjs");
const { Builder, By, Key, until, Actions } = require('selenium-webdriver');
let failures = 0;
let successes = 0;
let testsran = 0;
const Cookies = require("universal-cookie"); // Use 'Cookies' instead of 'Cookie'
async function authenticationTests() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {

    // connect to client URL
    await driver.get(clientConfig.CLIENT_URL);

    
    console.log("================================================================");

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

    console.log("----LOGIN----");

    console.log("Testing Criteria 5: Check if system properly handles no input:");

    await testNoInputLogin(driver);

    console.log("Testing Criteria 6: Check if system handles user not found in database:");

    await testUserNotFound(driver);

    console.log("Testing Criteria 7: Check if the system handles incorrect password:");

    await testIncorrectPassword(driver);

    console.log("Testing Criteria 8, 9 and 10: Check if system logs in with username or email, and that it successfully stores cookie:");

    await testLogin(driver);

    console.log("----CHANGE PASSWORD----");

    console.log("Testing Criteria 11: Check if system properly handles no input:");

    await testChangePasswordNoInput(driver);

    console.log("Testing Criteria 12: Check if system handles incorrect password:");

    await testChangePasswordIncorrect(driver);

    console.log("Testing Criteria 13: Check if the system successfully changes to new password:");

    await testChangePassword(driver);

    console.log("----CHANGE USERNAME----");

    console.log("Testing Criteria 14: Check if system properly handles no input:");

    await testChangeUsernameNoInput(driver);

    console.log("Testing Criteria 15: Check if system handles incorrect password:");

    await testChangeUsernameIncorrect(driver);

    console.log("Testing Criteria 16: Check if the system successfully changes to new username:");

    await testChangeUsername(driver);

  } catch (error) {
    console.error("A test failure occured. terminating tests.");
  } finally {
    console.log("================================================================");
    console.log("Tests Ran: " + testsran);
    console.log("Successes: " + successes);
    console.log("Failures: " + failures);
    console.log("================================================================");
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
            successes++;
            console.log("Passed");
        }
        else {
            throw new Error("Error message does not display");
        }
    }
    catch (error) {
        failures++;
        console.error("Failed");
    }

    testsran++;

    // clearing textfield entries:
    await driver.findElement(By.id('password')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('password')).sendKeys(Key.DELETE);
    await driver.findElement(By.id('email')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('email')).sendKeys(Key.DELETE);

    console.log("Test ID 1:");

    await driver.findElement(By.id('username')).sendKeys('testing');
    await driver.findElement(By.id('email')).sendKeys('testing@testing.com');


    await driver.findElement(By.css('button[type="submit"]')).click();

    const activeElement2 = await driver.switchTo().activeElement();
    const messageStr2 = await activeElement2.getAttribute("validationMessage");

    try {
        if (messageStr2 === 'Please fill out this field.') {
            successes++;
            console.log("Passed");
        } 
        else {
            throw new Error("Error message does not display");
        }
    }
    catch (error) {
        failures++;
        console.error("Failed");
    }

    testsran++;

    await driver.findElement(By.id('username')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('username')).sendKeys(Key.DELETE);
    await driver.findElement(By.id('email')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('email')).sendKeys(Key.DELETE);


    console.log("Test ID 2:");

    await driver.findElement(By.id('username')).sendKeys('testing');
    await driver.findElement(By.id('password')).sendKeys('password');
    await driver.findElement(By.css('button[type="submit"]')).click();

    const activeElement3 = await driver.switchTo().activeElement();
    const messageStr3 = await activeElement3.getAttribute("validationMessage");

    try {
        if (messageStr3 === 'Please fill out this field.') {
            successes++;
            console.log("Passed");
        } else {
            throw new Error("Error message does not display");
        }
    }
    catch (error) {
        failures++;
        console.error("Failed");
    }

    testsran++;

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

    const activeElement1 = await driver.switchTo().activeElement();
    const messageStr1 = await activeElement1.getAttribute("validationMessage");

    try {
        if (messageStr1 === "Please include an '@' in the email address. 'testingtesting.com' is missing an '@'.") {
            successes++;
            console.log("Passed");
        } else {
            throw new Error("Error message does not display");
        }
    }
    catch (error) {
        failures++;
        console.error("Failed");
    }

    testsran++;

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
            successes++;
            console.log("Passed");
        } else {
            throw new Error("User not registered");
        }
    } catch (error) {
        failures++;
        console.error("Failed");
    }    

    testsran++;
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
            successes++;
            console.log("Passed");
        } else {
            throw new Error("Error message not displayed");
        }
    } catch (error) {
        failures++;
        console.error("Failed");
    }

    testsran++;
}

async function testNoInputLogin(driver) {

    // console.log("Waiting for 10 seconds...");
    // await new Promise(resolve => setTimeout(resolve, 10000));

    console.log("Test ID 6:");

    await driver.actions().move({ x: 100, y: 100 }).click().perform();

    await driver.findElement(By.id('signin')).click();

    await driver.findElement(By.id('password')).sendKeys('password');
    await driver.findElement(By.css('button[type="submit"]')).click();

    const activeElement1 = await driver.switchTo().activeElement();
    const messageStr1 = await activeElement1.getAttribute("validationMessage");

    try {
        if (messageStr1 === 'Please fill out this field.') {
            successes++;
            console.log("Passed");
        }
        else {
            throw new Error("Error message does not display");
        }
    }
    catch (error) {
        failures++;
        console.error("Failed");
    }

    testsran++;

    // clearing textfield entries:
    await driver.findElement(By.id('password')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('password')).sendKeys(Key.DELETE);

    console.log("Test ID 7:");

    await driver.findElement(By.id('identity')).sendKeys('testing');
    await driver.findElement(By.css('button[type="submit"]')).click();

    const activeElement2 = await driver.switchTo().activeElement();
    const messageStr2 = await activeElement2.getAttribute("validationMessage");

    try {
        if (messageStr2 === 'Please fill out this field.') {
            successes++;
            console.log("Passed");
        } 
        else {
            throw new Error("Error message does not display");
        }
    }
    catch (error) {
        failures++;
        console.error("Failed");
    }

    testsran++;

    await driver.findElement(By.id('identity')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('identity')).sendKeys(Key.DELETE);
}

async function testUserNotFound(driver) {

    // console.log("Waiting for 10 seconds...");
    // await new Promise(resolve => setTimeout(resolve, 10000));

    console.log("Test ID 8:");

    await driver.findElement(By.id('identity')).sendKeys('badtesting');
    await driver.findElement(By.id('password')).sendKeys('password');
    await driver.findElement(By.css('button[type="submit"]')).click();

    await new Promise(resolve => setTimeout(resolve, 100)); // wait for errorbox to display
    const errorMessageElement = await driver.findElement(By.id("error-box"));
    const isErrorMessageDisplayed = await errorMessageElement.isDisplayed();

    try {
        if (isErrorMessageDisplayed) {
            successes++;
            console.log("Passed");
        } else {
            throw new Error("Error message not displayed");
        }
    } catch (error) {
        failures++;
        console.error("Failed");
    }

    testsran++;

    await driver.findElement(By.id('identity')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('identity')).sendKeys(Key.DELETE);
    await driver.findElement(By.id('password')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('password')).sendKeys(Key.DELETE);
}

async function testIncorrectPassword(driver) {

    // console.log("Waiting for 10 seconds...");
    // await new Promise(resolve => setTimeout(resolve, 10000));

    console.log("Test ID 9:");

    await driver.findElement(By.id('identity')).sendKeys('testing');
    await driver.findElement(By.id('password')).sendKeys('wrongpassword');
    await driver.findElement(By.css('button[type="submit"]')).click();

    await new Promise(resolve => setTimeout(resolve, 500)); // wait for errorbox to display
    const errorMessageElement = await driver.findElement(By.id("error-box"));
    const isErrorMessageDisplayed = await errorMessageElement.isDisplayed();

    try {
        if (isErrorMessageDisplayed) {
            successes++;
            console.log("Passed");
        } else {
            throw new Error("Error message not displayed");
        }
    } catch (error) {
        failures++;
        console.error("Failed");
    }

    testsran++;

    await driver.findElement(By.id('identity')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('identity')).sendKeys(Key.DELETE);
    await driver.findElement(By.id('password')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('password')).sendKeys(Key.DELETE);
}

async function testLogin(driver) {
    // console.log("Waiting for 10 seconds...");
    // await new Promise(resolve => setTimeout(resolve, 10000));

    console.log("Test ID 10:");

    await driver.findElement(By.id('identity')).sendKeys('testing');
    await driver.findElement(By.id('password')).sendKeys('password');
    await driver.findElement(By.css('button[type="submit"]')).click();

    await new Promise(resolve => setTimeout(resolve, 500));

    const accountIcon = await driver.findElements(By.id('account-icon'));

    try {
        // Check if the element exists
        if (accountIcon.length > 0) {
            successes++;
            console.log('Passed');
        } else {
            throw new Error('Failed');
        }
    } catch (error) {
        failures++;
        console.error("Failed");
    }

    testsran++;

    let userCookie = "";

    const cookies = await driver.manage().getCookie("userId").then(function(cookie) {
    //   console.log('cookie details => ', cookie.value);
      userCookie = cookie.value;
    });
  
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        // Check if the element exists
        if (userCookie.length > 0) {
            successes++;
            console.log('Passed');
        } else {
            throw new Error('Failed');
        }
    } catch (error) {
        failures++;
        console.error("Failed");
    }

    testsran++;

    await driver.findElement(By.id("account-icon")).click();
    await driver.findElement(By.xpath('//li[text()="Logout"]')).click();

    console.log("Test ID 11:");

    await driver.findElement(By.id('signin')).click();
    await driver.findElement(By.id('identity')).sendKeys('testing@testing.com');
    await driver.findElement(By.id('password')).sendKeys('password');
    await driver.findElement(By.css('button[type="submit"]')).click();

    await new Promise(resolve => setTimeout(resolve, 500));

    const accountIcon2 = await driver.findElements(By.id('account-icon'));

    try {
        // Check if the element exists
        if (accountIcon2.length > 0) {
            successes++;
            console.log('Passed');
        } else {
            throw new Error('Failed');
        }
    } catch (error) {
        failures++;
        console.error("Failed");
    }

    testsran++;
}

async function testChangePasswordNoInput(driver) {
    // console.log("Waiting for 10 seconds...");
    // await new Promise(resolve => setTimeout(resolve, 10000));

    console.log("Test ID 12:");

    await driver.findElement(By.id("account-icon")).click();
    await driver.findElement(By.xpath('//li[text()="Profile"]')).click();
    await driver.findElement(By.id('change-password')).click();
    await driver.findElement(By.id('newPassword')).sendKeys('newpassword');
    await driver.findElement(By.css('button[type="submit"]')).click();

    const activeElement1 = await driver.switchTo().activeElement();
    const messageStr1 = await activeElement1.getAttribute("validationMessage");

    try {
        if (messageStr1 === 'Please fill out this field.') {
            successes++;
            console.log("Passed");
        } 
        else {
            throw new Error("Error message does not display");
        }
    }
    catch (error) {
        failures++;
        console.error("Failed");
    }

    testsran++;

    await driver.findElement(By.id('newPassword')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('newPassword')).sendKeys(Key.DELETE);

    console.log("Test ID 13:");

    await driver.findElement(By.id('oldPassword')).sendKeys('password');
    await driver.findElement(By.css('button[type="submit"]')).click();
    const activeElement2 = await driver.switchTo().activeElement();
    const messageStr2 = await activeElement2.getAttribute("validationMessage");

    try {
        if (messageStr2 === 'Please fill out this field.') {
            successes++;
            console.log("Passed");
        } 
        else {
            throw new Error("Error message does not display");
        }
    }
    catch (error) {
        failures++;
        console.error("Failed");
    }

    testsran++;

    await driver.findElement(By.id('oldPassword')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('oldPassword')).sendKeys(Key.DELETE);
}

async function testChangePasswordIncorrect(driver) {
    // console.log("Waiting for 10 seconds...");
    // await new Promise(resolve => setTimeout(resolve, 10000));

    console.log("Test ID 14:");

    await driver.findElement(By.id('oldPassword')).sendKeys('wrongpassword');
    await driver.findElement(By.id('newPassword')).sendKeys('newpassword');
    await driver.findElement(By.css('button[type="submit"]')).click();

    await new Promise(resolve => setTimeout(resolve, 500)); // wait for errorbox to display
    const errorMessageElement1 = await driver.findElement(By.id("error-box"));
    const isErrorMessageDisplayed1 = await errorMessageElement1.isDisplayed();

    try {
        if (isErrorMessageDisplayed1) {
            successes++;
            console.log("Passed");
        } else {
            throw new Error("Error message not displayed");
        }
    } catch (error) {
        failures++;
        console.error("Failed");
    }

    testsran++;

    await driver.findElement(By.id('oldPassword')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('oldPassword')).sendKeys(Key.DELETE);
    await driver.findElement(By.id('newPassword')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('newPassword')).sendKeys(Key.DELETE);
}

async function testChangePassword(driver) {
    // console.log("Waiting for 10 seconds...");
    // await new Promise(resolve => setTimeout(resolve, 10000));

    console.log("Test ID 15:");

    await driver.findElement(By.id('oldPassword')).sendKeys('password');
    await driver.findElement(By.id('newPassword')).sendKeys('newpassword');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = await fetchUser("testing");

    try {
        if (bcrypt.compareSync("newpassword", user.password)) {
            successes++;
            // If old password mtaches
            console.log("Passed");
        }
        else {
            throw new Error("password was not updated");
        }
    } catch (error) {
        failures++;
        console.error("Failed");
    } 

    testsran++;
}

async function testChangeUsernameNoInput(driver) {
    // console.log("Waiting for 10 seconds...");
    // await new Promise(resolve => setTimeout(resolve, 10000));

    console.log("Test ID 16:");

    await driver.findElement(By.id('change-username')).click();
    await driver.findElement(By.id('password')).sendKeys('newpassword');
    await driver.findElement(By.css('button[type="submit"]')).click();

    const activeElement1 = await driver.switchTo().activeElement();
    const messageStr1 = await activeElement1.getAttribute("validationMessage");

    try {
        if (messageStr1 === 'Please fill out this field.') {
            successes++;
            console.log("Passed");
        } 
        else {
            throw new Error("Error message does not display");
        }
    }
    catch (error) {
        failures++;
        console.error("Failed");
    }

    testsran++;

    await driver.findElement(By.id('password')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('password')).sendKeys(Key.DELETE);

    console.log("Test ID 17:");

    await driver.findElement(By.id('newUsername')).sendKeys('newtesting');
    await driver.findElement(By.css('button[type="submit"]')).click();
    const activeElement2 = await driver.switchTo().activeElement();
    const messageStr2 = await activeElement2.getAttribute("validationMessage");

    try {
        if (messageStr2 === 'Please fill out this field.') {
            successes++;
            console.log("Passed");
        } 
        else {
            throw new Error("Error message does not display");
        }
    }
    catch (error) {
        failures++;
        console.error("Failed");
    }

    testsran++;

    await driver.findElement(By.id('newUsername')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('newUsername')).sendKeys(Key.DELETE);
}

async function testChangeUsernameIncorrect(driver) {
    // console.log("Waiting for 10 seconds...");
    // await new Promise(resolve => setTimeout(resolve, 10000));

    console.log("Test ID 18:");

    await driver.findElement(By.id('newUsername')).sendKeys('newtesting');
    await driver.findElement(By.id('password')).sendKeys('wrongpassword');
    await driver.findElement(By.css('button[type="submit"]')).click();

    await new Promise(resolve => setTimeout(resolve, 500)); // wait for errorbox to display
    const errorMessageElement1 = await driver.findElement(By.id("error-box"));
    const isErrorMessageDisplayed1 = await errorMessageElement1.isDisplayed();

    try {
        if (isErrorMessageDisplayed1) {
            successes++;
            console.log("Passed");
        } else {
            throw new Error("Error message not displayed");
        }
    } catch (error) {
        failures++;
        console.error("Failed");
    }

    testsran++;

    await driver.findElement(By.id('newUsername')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('newUsername')).sendKeys(Key.DELETE);
    await driver.findElement(By.id('password')).sendKeys(Key.CONTROL + "a");
    await driver.findElement(By.id('password')).sendKeys(Key.DELETE);
}

async function testChangeUsername(driver) {
    // console.log("Waiting for 10 seconds...");
    // await new Promise(resolve => setTimeout(resolve, 10000));

    console.log("Test ID 19:");

    await driver.findElement(By.id('newUsername')).sendKeys('newtesting');
    await driver.findElement(By.id('password')).sendKeys('newpassword');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await new Promise(resolve => setTimeout(resolve, 500)); // wait for user to change username in database

    const user = await fetchUser("newtesting");

    // Verify username changed
    try {
        if (user) {
            // console.log("User is registered: " + JSON.stringify(isUserRegistered));
            successes++;
            console.log("Passed");
        } else {
            throw new Error("User not registered");
        }
    } catch (error) {
        failures++;
        console.error("Failed");

    }   

    testsran++;
}

module.exports = authenticationTests;