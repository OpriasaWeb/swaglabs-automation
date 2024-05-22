const { By, Builder, until, Key } = require("selenium-webdriver")
const assert = require("assert")


describe("Verify login functionalities of Swag Labs", async () => {
  let driver

  before(async () => {
    driver = await new Builder().forBrowser("MicrosoftEdge").build()
    await driver.get("https://www.saucedemo.com/")
    
  })

  after(async () => {
    await driver.quit()
  })

  describe("Test the login with incorrect credentials", async () => {

    it("Verify if user is unable to login using incorrect username and password", async () => {
      try {
        // Clear the username and password inputs for next it block
        const usernameField = await driver.findElement(By.id("user-name"))
        await usernameField.sendKeys(Key.CONTROL, 'a') // Select all text in the field
        await usernameField.sendKeys(Key.BACK_SPACE)

        const passwordField = await driver.findElement(By.id("password"))
        await passwordField.sendKeys(Key.CONTROL, 'a') // Select all text in the field
        await passwordField.sendKeys(Key.BACK_SPACE) 

        await driver.findElement(By.id("user-name")).sendKeys("strandard_users")
        await driver.findElement(By.id("password")).sendKeys("sentret_sows")

        await driver.findElement(By.id("login-button")).click()
  
        // Epic sadface: Username and password do not match any user in this service
        let validationMessage = await driver.findElement(By.xpath("//h3[@data-test='error']")).getText()
  
        assert.strictEqual(validationMessage, "Epic sadface: Username and password do not match any user in this service")

      } catch (error) {
        console.log(error)
      } 
    })
  
    it("Verify if user is unable to login using incorrect username but correct password", async () => {
      try {
        // Clear the username and password inputs for next it block
        const usernameField = await driver.findElement(By.id("user-name"))
        await usernameField.sendKeys(Key.CONTROL, 'a') // Select all text in the field
        await usernameField.sendKeys(Key.BACK_SPACE) 

        const passwordField = await driver.findElement(By.id("password"))
        await passwordField.sendKeys(Key.CONTROL, 'a') // Select all text in the field
        await passwordField.sendKeys(Key.BACK_SPACE) 

        await driver.findElement(By.id("user-name")).sendKeys("strandard_users")
        await driver.findElement(By.id("password")).sendKeys("secret_sauce")
  
        await driver.findElement(By.id("login-button")).click()
  
        let validationMessage = await driver.findElement(By.xpath("//h3[@data-test='error']")).getText()
  
        assert.strictEqual(validationMessage, "Epic sadface: Username and password do not match any user in this service")

  
      } catch (error) {
        console.log(error)
      }
    })
  
    it("Verify if user is unable to login using incorrect password but correct username", async () => {
      try {
        // Clear the username and password inputs for next it block
        const usernameField = await driver.findElement(By.id("user-name"))
        await usernameField.sendKeys(Key.CONTROL, 'a') // Select all text in the field
        await usernameField.sendKeys(Key.BACK_SPACE) 

        const passwordField = await driver.findElement(By.id("password"))
        await passwordField.sendKeys(Key.CONTROL, 'a') // Select all text in the field
        await passwordField.sendKeys(Key.BACK_SPACE) 

        await driver.findElement(By.id("user-name")).sendKeys("standard_user")
        await driver.findElement(By.id("password")).sendKeys("sentret_sows")
  
        await driver.findElement(By.id("login-button")).click()
  
        let validationMessage = await driver.findElement(By.xpath("//h3[@data-test='error']")).getText()
  
        assert.strictEqual(validationMessage, "Epic sadface: Username and password do not match any user in this service")
  
      } catch (error) {
        console.log(error)
      }
    })
  
    it("Verify if user is unable to login with empty credentials such as username and password", async () => {
      try {

        await driver.findElement(By.className("error-button")).click()

        // Clear the username and password inputs for next it block
        const usernameField = await driver.findElement(By.id("user-name"))
        await usernameField.sendKeys(Key.CONTROL, 'a') // Select all text in the field
        await usernameField.sendKeys(Key.BACK_SPACE) 

        const passwordField = await driver.findElement(By.id("password"))
        await passwordField.sendKeys(Key.CONTROL, 'a') // Select all text in the field
        await passwordField.sendKeys(Key.BACK_SPACE) 

        // await driver.wait(until.elementIsNotVisible(By.className("error-message-container")), 5000)
  
        await driver.findElement(By.id("login-button")).click()
  
        let validationMessage = await driver.wait(until.elementLocated(By.xpath("//h3[@data-test='error']")))
  
        assert.strictEqual(await validationMessage.getText(), "Epic sadface: Username is required")
  
      } catch (error) {
        console.log(error)
      }
    })

    it("Verify if user is unable to login with empty password input", async () => {
      try {

        await driver.findElement(By.className("error-button")).click()

        // fill in username
        await driver.findElement(By.id("user-name")).sendKeys("standard_user")

        // await driver.wait(until.elementIsNotVisible(By.className("error-message-container")), 5000)
  
        await driver.findElement(By.id("login-button")).click()
  
        let validationMessage = await driver.wait(until.elementLocated(By.xpath("//h3[@data-test='error']")))
  
        assert.strictEqual(await validationMessage.getText(), "Epic sadface: Password is required")
  
      } catch (error) {
        console.log(error)
      }
    })

    it("Verify if locked_out_user is unable to login", async () => {
      try {
        // Close the validation error message
        await driver.findElement(By.className("error-button")).click()

        // Clear the username input for next it block
        const usernameField = await driver.findElement(By.id("user-name"))
        await usernameField.sendKeys(Key.CONTROL, 'a') // Select all text in the field
        await usernameField.sendKeys(Key.BACK_SPACE) 

        // Clear password field
        const passwordField = await driver.findElement(By.id("password"))
        await passwordField.sendKeys(Key.CONTROL, 'a') // Select all text in the field
        await passwordField.sendKeys(Key.BACK_SPACE) 

        await driver.findElement(By.id("user-name")).sendKeys("locked_out_user")
        await driver.findElement(By.id("password")).sendKeys("secret_sauce")

        await driver.findElement(By.id("login-button")).click()

        let validationMessage = await driver.findElement(By.xpath("//h3[@data-test='error']")).getText()
  
        assert.strictEqual(validationMessage, "Epic sadface: Sorry, this user has been locked out.")

        const url = "https://www.saucedemo.com/"
        let currentUrl = await driver.getCurrentUrl();
        assert.equal(currentUrl, url)

      } catch (error) {
        console.log(error)
      }
    })

    it("Verify if user is unable to login with empty username input", async () => {
      try {

        // Clear the username input for next it block
        const usernameField = await driver.findElement(By.id("user-name"))
        await usernameField.sendKeys(Key.CONTROL, 'a') // Select all text in the field
        await usernameField.sendKeys(Key.BACK_SPACE) 

        // Clear password field
        const passwordField = await driver.findElement(By.id("password"))
        await passwordField.sendKeys(Key.CONTROL, 'a') // Select all text in the field
        await passwordField.sendKeys(Key.BACK_SPACE) 

        // Fill in password
        await driver.findElement(By.id("password")).sendKeys("secret_sauce")

        await driver.findElement(By.id("login-button")).click()
  
        let validationMessage = await driver.wait(until.elementLocated(By.xpath("//h3[@data-test='error']")))

        assert.strictEqual(await validationMessage.getText(), "Epic sadface: Username is required")

      } catch (error) {
        console.log()
      }
    })
  })

  describe("Test the login with correct credentials", async () => {

    it("Verify if user is able to login using correct username and password", async () => {
      try {
        // Close the validation error message
        await driver.findElement(By.className("error-button")).click()

        // Clear password field
        const passwordField = await driver.findElement(By.id("password"))
        await passwordField.sendKeys(Key.CONTROL, 'a') // Select all text in the field
        await passwordField.sendKeys(Key.BACK_SPACE) 

        await driver.findElement(By.id("user-name")).sendKeys("standard_user")
        await driver.findElement(By.id("password")).sendKeys("secret_sauce")

        await driver.findElement(By.id("login-button")).click()

        const url = "https://www.saucedemo.com/inventory.html"
        let currentUrl = await driver.getCurrentUrl();
        assert.equal(currentUrl, url)
      } catch (error) {
        console.log(error)
      }
    })
  })



})