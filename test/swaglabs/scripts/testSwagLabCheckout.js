const { By, Builder, until, Key } = require("selenium-webdriver")
const assert = require("assert")

describe("Verify checkout procedures of swag labs e-commerce", async () => {
  let driver

  before(async () => {
    driver = await new Builder().forBrowser("MicrosoftEdge").build();
    await driver.get("https://www.saucedemo.com/");
  });

  after(async () => {
    await driver.quit();
  });

  async function verifyUrl(url){
    let currentUrl = await driver.getCurrentUrl();
    assert.strictEqual(currentUrl, url);
  }

  async function verifyTitle(expectedTitle) {
    let currentPageTitle = await driver.getTitle();
    assert.strictEqual(currentPageTitle, expectedTitle);
  }

  async function verifyCurrentPage(page){
    let currentPageTitle = await driver.findElement(By.className("title"))
    assert.deepEqual(await currentPageTitle.getText(), page)
  }

  async function completeInformation(firstname, lastname, zipcode){
    await driver.findElement(By.xpath("//input[@id='first-name']")).sendKeys(firstname)
    await driver.findElement(By.xpath("//input[@id='last-name']")).sendKeys(lastname)
    await driver.findElement(By.xpath("//input[@id='postal-code']")).sendKeys(zipcode)
  }

  async function firstAndLastName(firstname, lastname){
    await driver.findElement(By.xpath("//input[@id='first-name']")).sendKeys(firstname)
    await driver.findElement(By.xpath("//input[@id='last-name']")).sendKeys(lastname)
  }

  async function firstNameAndZipCode(firstname, zipcode){
    await driver.findElement(By.xpath("//input[@id='first-name']")).sendKeys(firstname)
    await driver.findElement(By.xpath("//input[@id='postal-code']")).sendKeys(zipcode)
  }

  async function lastNameAndZipCode(lastname, zipcode){
    await driver.findElement(By.xpath("//input[@id='last-name']")).sendKeys(lastname)
    await driver.findElement(By.xpath("//input[@id='postal-code']")).sendKeys(zipcode)
  }

  async function addToCart(cart){
    let addtoCart = await driver.findElement(By.id(cart))
    await addtoCart.click()
  }

  async function removeToCart(remove){
    let removeProduct = await driver.findElement(By.id(remove)) // note, will remove here
    await removeProduct.click()
  }

  async function login(username, password){
    await driver.findElement(By.id("user-name")).sendKeys(username);
    await driver.findElement(By.id("password")).sendKeys(password);
    const loginButton = await driver.findElement(By.id("login-button"));
    await loginButton.click()
  }

  async function clearInput(name){
    const clearField = await driver.findElement(By.xpath(`//input[@id='${name}']`))
    await clearField.sendKeys(Key.CONTROL, 'a') 
    await clearField.sendKeys(Key.BACK_SPACE)
  }

  async function assertEqual(actual, expected, comments){
    assert.equal(actual, expected, comments)
  }

  describe("Test login with correct credentials to redirect on inventory page", async () => {
    it("Verify if user is able to login using correct username and password", async () => {
      await login("standard_user", "secret_sauce")
      await driver.wait(until.urlIs("https://www.saucedemo.com/inventory.html"), 10000); // Wait until redirected to inventory page
      // Assert url
      await verifyUrl("https://www.saucedemo.com/inventory.html")
    });
  });

  describe("Verify if user is able to checkout product", async () => {

    it("Verify if user is able to checkout with product/s on its cart", async () => {
      // Assertion if on the right page
      await verifyUrl("https://www.saucedemo.com/inventory.html")
  
      // Assert the title of the page
      await verifyTitle("Swag Labs")

      // Add to cart
      await addToCart("add-to-cart-sauce-labs-bolt-t-shirt")
      await addToCart("add-to-cart-test.allthethings()-t-shirt-(red)")
      await addToCart("add-to-cart-sauce-labs-onesie")

      // Assert the cart badge current value
      // Wait for the add to cart increment value
      let totalOfAddedToCart = await driver.wait(until.elementLocated(By.xpath("//span[@data-test='shopping-cart-badge']")), 5000)
      await driver.wait(until.elementIsVisible(totalOfAddedToCart), 5000)

      // Get the total, in this case this should be two (2)
      let addedToCartText = await driver.findElement(By.xpath("//span[@data-test='shopping-cart-badge']"))
      assertEqual(await addedToCartText.getText(), 3, "Cart badge should be 3")

      // Click the cart icon
      await addedToCartText.click()

      // Assert the redirected page - cart page
      await verifyUrl("https://www.saucedemo.com/cart.html")

      // Assert the title of the current page
      await verifyCurrentPage("Your Cart")

      // Assert the product/s remove to cart
      await removeToCart("remove-sauce-labs-bolt-t-shirt") // note, will remove here

      let currentCartBadge = await driver.findElement(By.className("shopping_cart_badge"))
      assert.deepEqual(await currentCartBadge.getText(), 2, "Successfully remove the added product")

      let storeAddedProduct = []

      const allInventoryItems = await driver.findElements(By.className("inventory_item_name"))
      for(let allInventoryItem of allInventoryItems){
        storeAddedProduct.push(await allInventoryItem.getText())
      }
      storeAddedProduct.sort()

      // Assert the added product/s
      const allProducts = [...storeAddedProduct].sort()

      for(let i = 0; i < allProducts.length; i++){
        assert.deepEqual(await storeAddedProduct[i], await allProducts[i])
      }

      await driver.findElement(By.id("checkout")).click()

      // Assert next page - check out step one page
      await verifyUrl("https://www.saucedemo.com/checkout-step-one.html")

    })

    it("Verify if user is unable to continue checking-out product with empty information", async () => {
      // Assert current page
      await verifyUrl("https://www.saucedemo.com/checkout-step-one.html")

      let continueButton = await driver.findElement(By.id("continue"))
      await continueButton.click()

      // await driver.wait(until.elementIsVisible(By.id("error-message-container")), 5000)
      let locateMessage = await driver.wait(until.elementLocated(By.xpath("//h3[@data-test='error']")), 5000)
      await driver.wait(until.elementIsVisible(locateMessage), 5000)

      let errorMessage = await driver.findElement(By.xpath("//h3[@data-test='error']"))
      assert.equal(await errorMessage.getText(), "Error: First Name is required")
    })

    it("Verify if user is unable to move forward checking-out product with empty first name but filled-in last name and zip code", async () => {
      // Fill in last name and zip code but leave the first name empty
      await lastNameAndZipCode("test", "1750")

      let continueButton = await driver.findElement(By.id("continue"))
      await continueButton.click()

      // await driver.wait(until.elementIsVisible(By.id("error-message-container")), 5000)
      let locateMessage = await driver.wait(until.elementLocated(By.xpath("//h3[@data-test='error']")), 5000)
      await driver.wait(until.elementIsVisible(locateMessage), 5000)

      let errorMessage = await driver.findElement(By.xpath("//h3[@data-test='error']"))
      assert.equal(await errorMessage.getText(), "Error: First Name is required")
    })

    it("Verify if user is unable to move forward checking-out product with empty first name and last name but filled-in zip code", async () => {
      // Clear last name
      await clearInput('last-name')

      let continueButton = await driver.findElement(By.id("continue"))
      await continueButton.click()

      // await driver.wait(until.elementIsVisible(By.id("error-message-container")), 5000)
      let locateMessage = await driver.wait(until.elementLocated(By.xpath("//h3[@data-test='error']")), 5000)
      await driver.wait(until.elementIsVisible(locateMessage), 5000)

      let errorMessage = await driver.findElement(By.xpath("//h3[@data-test='error']"))
      assert.equal(await errorMessage.getText(), "Error: First Name is required")
    })

    it("Verify if user is unable to move forward checking-out product with empty first name and zip code but filled-in last name", async () => {
      // Fill in last name but leave the first name and zip code empty
      await driver.findElement(By.xpath("//input[@id='last-name']")).sendKeys("test")

      // Clear postal
      await clearInput('postal-code')

      let continueButton = await driver.findElement(By.id("continue"))
      await continueButton.click()

      // await driver.wait(until.elementIsVisible(By.id("error-message-container")), 5000)
      let locateMessage = await driver.wait(until.elementLocated(By.xpath("//h3[@data-test='error']")), 5000)
      await driver.wait(until.elementIsVisible(locateMessage), 5000)

      let errorMessage = await driver.findElement(By.xpath("//h3[@data-test='error']"))
      assert.equal(await errorMessage.getText(), "Error: First Name is required")
    })

    it("Verify if user is unable to move forward checking-out product with empty last name but filled-in first name and zip code", async () => {
      // Fill in first name and zip code but leave the last name empty
      await firstNameAndZipCode("test", "17500")

      // Clear postal
      await clearInput('last-name')

      let continueButton = await driver.findElement(By.id("continue"))
      await continueButton.click()

      // await driver.wait(until.elementIsVisible(By.id("error-message-container")), 5000)
      let locateMessage = await driver.wait(until.elementLocated(By.xpath("//h3[@data-test='error']")), 5000)
      await driver.wait(until.elementIsVisible(locateMessage), 5000)

      let errorMessage = await driver.findElement(By.xpath("//h3[@data-test='error']"))
      assert.equal(await errorMessage.getText(), "Error: Last Name is required")
    })

    it("Verify if user is unable to move forward checking-out product with empty last name and zip code but filled-in first name", async () => {

      // Clear first name
      await clearInput('first-name')

      // Fill in first name but leave the last name and zip code empty
      await driver.findElement(By.xpath("//input[@id='first-name']")).sendKeys("test")

      // Clear last name
      await clearInput('last-name')
      // Clear postal
      await clearInput('postal-code')

      let continueButton = await driver.findElement(By.id("continue"))
      await continueButton.click()

      // await driver.wait(until.elementIsVisible(By.id("error-message-container")), 5000)
      let locateMessage = await driver.wait(until.elementLocated(By.xpath("//h3[@data-test='error']")), 5000)
      await driver.wait(until.elementIsVisible(locateMessage), 5000)

      let errorMessage = await driver.findElement(By.xpath("//h3[@data-test='error']"))
      assert.equal(await errorMessage.getText(), "Error: Last Name is required")
    })

    it("Verify if user is unable to move forward checking-out product with empty zip code but filled-in first name and last name", async () => {
      // Clear first name
      await clearInput('first-name')

      // Fill in first name but leave the last name and zip code empty
      await firstAndLastName("test", "test")

      // Clear postal
      await clearInput('postal-code')

      let continueButton = await driver.findElement(By.id("continue"))
      await continueButton.click()

      // await driver.wait(until.elementIsVisible(By.id("error-message-container")), 5000)
      let locateMessage = await driver.wait(until.elementLocated(By.xpath("//h3[@data-test='error']")), 5000)
      await driver.wait(until.elementIsVisible(locateMessage), 5000)

      let errorMessage = await driver.findElement(By.xpath("//h3[@data-test='error']"))
      assert.equal(await errorMessage.getText(), "Error: Postal Code is required")
    })

    it("Verify if user is able to move forward checking-out product with complete information", async () => {
      // Clear inputs
      await clearInput('first-name')
      await clearInput('last-name')
      await clearInput('postal-code')

      // Fill in first name but leave the last name and zip code empty
      await completeInformation("test", "test", "1750")

      await driver.wait(until.elementLocated(By.id("continue")), 5000)
      let continueButton = await driver.findElement(By.id("continue"))
      await continueButton.click()

      // Assert the right page - check out step two
      await verifyUrl("https://www.saucedemo.com/checkout-step-two.html")

      let storeAddedProduct = []
      let itemTotal = 0
      let overallTotal = 0

      const allInventoryItems = await driver.findElements(By.className("inventory_item_name"))
      for(let allInventoryItem of allInventoryItems){
        storeAddedProduct.push(await allInventoryItem.getText())
      }
      storeAddedProduct.sort()

      // Assert the added product/s name
      const allProducts = [...storeAddedProduct].sort()

      for(let i = 0; i < allProducts.length; i++){
        assert.deepEqual(await storeAddedProduct[i], await allProducts[i])
      }

      // Calculate the item total
      const allInventoryItemPrices = await driver.findElements(By.className("inventory_item_price"))
      for(let allInventoryItemPrice of allInventoryItemPrices){
        let stringPrice = await allInventoryItemPrice.getText()
        let priceNumber = parseFloat(stringPrice.replace(/[^0-9.]/g, ''));
        itemTotal += priceNumber
      }
      assert.strictEqual(itemTotal, 23.98)

      // Calculate the item total with tax
      const summaryTax = await driver.findElement(By.className("summary_tax_label"))
      let textSummaryTax = await summaryTax.getText()
      let overallTaxTotal = parseFloat(textSummaryTax.replace(/[^0-9.]/g, ''));
      overallTotal = itemTotal + overallTaxTotal
      assert.strictEqual(itemTotal + overallTaxTotal, overallTotal)

      await driver.findElement(By.id("finish")).click()

      // Assert the right page - check out complete
      await verifyUrl("https://www.saucedemo.com/checkout-complete.html")

      // Assert the title of the current page
      let currentPageTitle = await driver.findElement(By.className("title"))
      assert.deepEqual(await currentPageTitle.getText(), "Checkout: Complete!")

      let successMessage = await driver.findElement(By.className("complete-header"))
      assert.strictEqual(await successMessage.getText(), "Thank you for your order!")

      // Back to product e-commerce
      await driver.findElement(By.id("back-to-products")).click()

      await verifyUrl("https://www.saucedemo.com/inventory.html")

    })

  })

})