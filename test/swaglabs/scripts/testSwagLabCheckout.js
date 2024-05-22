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

  describe("Test login with correct credentials to redirect on inventory page", async () => {
    it("Verify if user is able to login using correct username and password", async () => {

      await driver.findElement(By.id("user-name")).sendKeys("standard_user");
      await driver.findElement(By.id("password")).sendKeys("secret_sauce");
      await driver.findElement(By.id("login-button")).click();
      await driver.wait(until.urlIs("https://www.saucedemo.com/inventory.html"), 10000); // Wait until redirected to inventory page

      const url = "https://www.saucedemo.com/inventory.html";
      let currentUrl = await driver.getCurrentUrl();
      assert.equal(currentUrl, url);
    });
  });

  describe("Verify if user is able to checkout product", async () => {

    it("Verify if user is able to checkout with product/s on its cart", async () => {
      // Assertion if on the right page
      const url = "https://www.saucedemo.com/inventory.html";
      let currentUrl = await driver.getCurrentUrl();
      assert.equal(currentUrl, url);
  
      const pageTitle = "Swag Labs";
      let currentPage = await driver.getTitle()
      assert.equal(currentPage, pageTitle)

      // Add to cart
      let firstAddToCart = await driver.findElement(By.id("add-to-cart-sauce-labs-bolt-t-shirt"))
      await firstAddToCart.click()

      let secondAddToCart = await driver.findElement(By.id("add-to-cart-test.allthethings()-t-shirt-(red)")) // note, to be remove as testing goes on
      await secondAddToCart.click()

      let thirdAddToCart = await driver.findElement(By.id("add-to-cart-sauce-labs-onesie")) 
      await thirdAddToCart.click()

      // Assert the cart badge current value
      // Wait for the add to cart increment value
      let totalOfAddedToCart = await driver.wait(until.elementLocated(By.xpath("//span[@data-test='shopping-cart-badge']")), 5000)
      await driver.wait(until.elementIsVisible(totalOfAddedToCart), 5000)

      // Get the total, in this case this should be two (2)
      let addedToCartText = await driver.findElement(By.xpath("//span[@data-test='shopping-cart-badge']"))
      assert.equal(await addedToCartText.getText(), 3, "Cart badge should be 3")

      // Click the cart icon
      await addedToCartText.click()

      // Assert the redirected page
      const cartUrl = "https://www.saucedemo.com/cart.html";
      let cartCurrentUrl = await driver.getCurrentUrl();
      assert.equal(cartCurrentUrl, cartUrl);

      // Assert the title of the current page
      let currentPageTitle = await driver.findElement(By.className("title"))
      assert.deepEqual(await currentPageTitle.getText(), "Your Cart")

      // Assert the product/s added to cart
      let removeOneProduct = await driver.findElement(By.id("remove-sauce-labs-bolt-t-shirt")) // note, will remove here
      await removeOneProduct.click()

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

      // Assert next page
      const checkoutUrl = "https://www.saucedemo.com/checkout-step-one.html";
      let checkoutCurrentUrl = await driver.getCurrentUrl();
      assert.deepEqual(checkoutCurrentUrl, checkoutUrl);

    })

    it("Verify if user is unable to continue checking-out product with empty information", async () => {
      // Assert current page
      const checkoutUrl = "https://www.saucedemo.com/checkout-step-one.html";
      let checkoutCurrentUrl = await driver.getCurrentUrl();
      assert.deepEqual(checkoutCurrentUrl, checkoutUrl);

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
      await driver.findElement(By.xpath("//input[@id='last-name']")).sendKeys("test")
      await driver.findElement(By.xpath("//input[@id='postal-code']")).sendKeys("1750")

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
      const lastNameField = await driver.findElement(By.xpath("//input[@id='last-name']"))
      await lastNameField.sendKeys(Key.CONTROL, 'a') 
      await lastNameField.sendKeys(Key.BACK_SPACE) 

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
      const postalField = await driver.findElement(By.xpath("//input[@id='postal-code']"))
      await postalField.sendKeys(Key.CONTROL, 'a') 
      await postalField.sendKeys(Key.BACK_SPACE) 

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
      await driver.findElement(By.xpath("//input[@id='first-name']")).sendKeys("test")
      await driver.findElement(By.xpath("//input[@id='postal-code']")).sendKeys("17500")

      // Clear postal
      const postalField = await driver.findElement(By.xpath("//input[@id='last-name']"))
      await postalField.sendKeys(Key.CONTROL, 'a') 
      await postalField.sendKeys(Key.BACK_SPACE) 

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
      const firstNameField = await driver.findElement(By.xpath("//input[@id='first-name']"))
      await firstNameField.sendKeys(Key.CONTROL, 'a') 
      await firstNameField.sendKeys(Key.BACK_SPACE) 

      // Fill in first name but leave the last name and zip code empty
      await driver.findElement(By.xpath("//input[@id='first-name']")).sendKeys("test")

      // Clear last name
      const lastNameField = await driver.findElement(By.xpath("//input[@id='last-name']"))
      await lastNameField.sendKeys(Key.CONTROL, 'a') 
      await lastNameField.sendKeys(Key.BACK_SPACE) 

      // Clear postal
      const postalField = await driver.findElement(By.xpath("//input[@id='postal-code']"))
      await postalField.sendKeys(Key.CONTROL, 'a') 
      await postalField.sendKeys(Key.BACK_SPACE) 

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
      const firstNameField = await driver.findElement(By.xpath("//input[@id='first-name']"))
      await firstNameField.sendKeys(Key.CONTROL, 'a') 
      await firstNameField.sendKeys(Key.BACK_SPACE) 

      // Fill in first name but leave the last name and zip code empty
      await driver.findElement(By.xpath("//input[@id='first-name']")).sendKeys("test")
      await driver.findElement(By.xpath("//input[@id='last-name']")).sendKeys("test")

      // Clear postal
      const postalField = await driver.findElement(By.xpath("//input[@id='postal-code']"))
      await postalField.sendKeys(Key.CONTROL, 'a') 
      await postalField.sendKeys(Key.BACK_SPACE) 

      let continueButton = await driver.findElement(By.id("continue"))
      await continueButton.click()

      // await driver.wait(until.elementIsVisible(By.id("error-message-container")), 5000)
      let locateMessage = await driver.wait(until.elementLocated(By.xpath("//h3[@data-test='error']")), 5000)
      await driver.wait(until.elementIsVisible(locateMessage), 5000)

      let errorMessage = await driver.findElement(By.xpath("//h3[@data-test='error']"))
      assert.equal(await errorMessage.getText(), "Error: Postal Code is required")
    })

    it("Verify if user is unable to move forward checking-out product with complete information", async () => {
      // Clear first name
      const firstNameField = await driver.findElement(By.xpath("//input[@id='first-name']"))
      await firstNameField.sendKeys(Key.CONTROL, 'a') 
      await firstNameField.sendKeys(Key.BACK_SPACE) 

      // Clear last name
      const lastNameField = await driver.findElement(By.xpath("//input[@id='last-name']"))
      await lastNameField.sendKeys(Key.CONTROL, 'a') 
      await lastNameField.sendKeys(Key.BACK_SPACE) 

      // Clear postal
      const postalField = await driver.findElement(By.xpath("//input[@id='postal-code']"))
      await postalField.sendKeys(Key.CONTROL, 'a') 
      await postalField.sendKeys(Key.BACK_SPACE) 

      // Fill in first name but leave the last name and zip code empty
      await driver.findElement(By.xpath("//input[@id='first-name']")).sendKeys("test")
      await driver.findElement(By.xpath("//input[@id='last-name']")).sendKeys("test")
      await driver.findElement(By.xpath("//input[@id='postal-code']")).sendKeys("1750")

      let continueButton = await driver.findElement(By.id("continue"))
      await continueButton.click()

      const url = "https://www.saucedemo.com/checkout-step-two.html";
      let currentUrl = await driver.getCurrentUrl();
      assert.equal(currentUrl, url);

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

      const completeUrl = "https://www.saucedemo.com/checkout-complete.html";
      let completeCurrentUrl = await driver.getCurrentUrl();
      assert.equal(completeCurrentUrl, completeUrl);

      // Assert the title of the current page
      let currentPageTitle = await driver.findElement(By.className("title"))
      assert.deepEqual(await currentPageTitle.getText(), "Checkout: Complete!")

      let successMessage = await driver.findElement(By.className("complete-header"))
      assert.strictEqual(await successMessage.getText(), "Thank you for your order!")

      // Back to product e-commerce
      await driver.findElement(By.id("back-to-products")).click()

      const defaultUrl = "https://www.saucedemo.com/inventory.html";
      let defaultCurrentUrl = await driver.getCurrentUrl();
      assert.equal(defaultCurrentUrl, defaultUrl);

    })

  })

})