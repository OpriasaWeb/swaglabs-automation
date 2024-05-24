const { By, Builder, until, Key } = require("selenium-webdriver")
const assert = require("assert")
const { clear } = require("console")


describe("Verify login functionalities of Swag Labs", async () => {
  let driver

  before(async () => {
    driver = await new Builder().forBrowser("MicrosoftEdge").build()
    await driver.get("https://www.saucedemo.com/")
    
  })

  after(async () => {
    await driver.quit()
  })

  async function verifyUrl(url){
    let currentUrl = await driver.getCurrentUrl();
    assert.strictEqual(currentUrl, url);
  }

  async function login(username, password){
    await driver.findElement(By.id("user-name")).sendKeys(username);
    await driver.findElement(By.id("password")).sendKeys(password);
    const loginButton = await driver.findElement(By.id("login-button"));
    await loginButton.click()
  }

  async function loginUserName(username){
    await driver.findElement(By.id("user-name")).sendKeys(username);
    const loginButton = await driver.findElement(By.id("login-button"));
    await loginButton.click()
  }

  async function clearInput(name){
    const clearField = await driver.findElement(By.xpath(`//input[@id='${name}']`))
    await clearField.sendKeys(Key.CONTROL, 'a') 
    await clearField.sendKeys(Key.BACK_SPACE)
  }

  describe("Test the login with incorrect credentials", async () => {

    it("Verify if user is unable to login using incorrect username and password", async () => {
      // Clear the username and password inputs for next it block
      await clearInput("user-name")
      await clearInput("password")
      await login("strandard_users", "sentret_sows")

      // Epic sadface: Username and password do not match any user in this service
      let validationMessage = await driver.findElement(By.xpath("//h3[@data-test='error']")).getText()

      assert.strictEqual(validationMessage, "Epic sadface: Username and password do not match any user in this service")
    })
  
    it("Verify if user is unable to login using incorrect username but correct password", async () => {
      // Clear the username and password inputs for next it block
      await clearInput("user-name")
      await clearInput("password")

      await login("strandard_users", "secret_sauce")

      let validationMessage = await driver.findElement(By.xpath("//h3[@data-test='error']")).getText()

      assert.strictEqual(validationMessage, "Epic sadface: Username and password do not match any user in this service")
    })
  
    it("Verify if user is unable to login using incorrect password but correct username", async () => {
      // Clear the username and password inputs for next it block
      await clearInput("user-name")
      await clearInput("password")
      await login("standard_user", "sentret_sows")

      let validationMessage = await driver.findElement(By.xpath("//h3[@data-test='error']")).getText()

      assert.strictEqual(validationMessage, "Epic sadface: Username and password do not match any user in this service")
    })
  
    it("Verify if user is unable to login with empty credentials such as username and password", async () => {

      await driver.findElement(By.className("error-button")).click()

      // Clear the username and password inputs for next it block
      await clearInput("user-name")
      await clearInput("password")

      await driver.findElement(By.id("login-button")).click()

      let validationMessage = await driver.wait(until.elementLocated(By.xpath("//h3[@data-test='error']")))

      assert.strictEqual(await validationMessage.getText(), "Epic sadface: Username is required")
    })

    it("Verify if user is unable to login with empty password input", async () => {

      await driver.findElement(By.className("error-button")).click()

      // fill in username
      await loginUserName("standard_user")

      let validationMessage = await driver.wait(until.elementLocated(By.xpath("//h3[@data-test='error']")))

      assert.strictEqual(await validationMessage.getText(), "Epic sadface: Password is required")
    })

    it("Verify if locked_out_user is unable to login", async () => {

      // Close the validation error message
      await driver.findElement(By.className("error-button")).click()

      await clearInput("user-name")
      await clearInput("password")
      await login("locked_out_user", "secret_sauce")

      let validationMessage = await driver.findElement(By.xpath("//h3[@data-test='error']")).getText()

      assert.strictEqual(validationMessage, "Epic sadface: Sorry, this user has been locked out.")

      // Assert url
      await verifyUrl("https://www.saucedemo.com/")

    })

    it("Verify if user is unable to login with empty username input", async () => {

      // Close the validation error message
      await driver.findElement(By.className("error-button")).click()
      // Clear the username input for next it block
      await clearInput("user-name")
      await clearInput("password")

      // Fill in password
      await driver.findElement(By.id("password")).sendKeys("secret_sauce")

      await driver.findElement(By.id("login-button")).click()

      let validationMessage = await driver.wait(until.elementLocated(By.xpath("//h3[@data-test='error']")))

      assert.strictEqual(await validationMessage.getText(), "Epic sadface: Username is required")
    })
  })

  describe("Test the login with correct credentials", async () => {

    it("Verify if user is able to login using correct username and password", async () => {
      // Close the validation error message
      await driver.findElement(By.className("error-button")).click()

      await clearInput("password")
      await login("standard_user", "secret_sauce")
      await driver.wait(until.urlIs("https://www.saucedemo.com/inventory.html"), 10000);

      await verifyUrl("https://www.saucedemo.com/inventory.html") // assert url
    })
  })



})