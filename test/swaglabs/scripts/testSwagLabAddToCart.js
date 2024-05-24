const { By, Builder, until, Key } = require("selenium-webdriver")
const assert = require("assert")

describe("Test add to cart functionality", async () => {
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

  describe("Test login with correct credentials to redirect on inventory page", async () => {
    it("Verify if user is able to login using correct username and password", async () => {

      await driver.findElement(By.id("user-name")).sendKeys("standard_user");
      await driver.findElement(By.id("password")).sendKeys("secret_sauce");
      await driver.findElement(By.id("login-button")).click();
      await driver.wait(until.urlIs("https://www.saucedemo.com/inventory.html"), 10000); // Wait until redirected to inventory page

      await verifyUrl("https://www.saucedemo.com/inventory.html")

    });
  });

  describe("Test cart badge increment and decrement", async () => {
    it("Verify if the cart is incrementing to one after clicking the Add to cart button in each product", async () => {

      // Assertion if on the right page
      await verifyUrl("https://www.saucedemo.com/inventory.html") // Note, feel free to change to test assertion

      await verifyTitle("Swag Labs") // Note, feel free to change to test assertion

      // Add to cart
      let firstAddToCart = await driver.findElement(By.id("add-to-cart-sauce-labs-bolt-t-shirt"))
      await firstAddToCart.click()

      let secondAddToCart = await driver.findElement(By.id("add-to-cart-test.allthethings()-t-shirt-(red)")) 
      await secondAddToCart.click()

      // Assert the cart badge current value
      // Wait for the add to cart increment value
      let totalOfAddedToCart = await driver.wait(until.elementLocated(By.xpath("//span[@data-test='shopping-cart-badge']")), 5000)
      await driver.wait(until.elementIsVisible(totalOfAddedToCart), 5000)

      // Get the total, in this case this should be two (2)
      let addedToCartText = await driver.findElement(By.xpath("//span[@data-test='shopping-cart-badge']"))
      assert.equal(await addedToCartText.getText(), 2, "Cart badge should be 2")
      
    })

    it("Verify if the cart is decrementing to one after clicking the Remove button in each product", async () => {

      await verifyUrl("https://www.saucedemo.com/inventory.html") // Note, feel free to change to test assertion

      // Wait for the element to change
      await driver.wait(until.elementLocated(By.id("remove-sauce-labs-bolt-t-shirt")), 5000)
      
      // Remove to cart
      let removeToCart = await driver.findElement(By.id("remove-sauce-labs-bolt-t-shirt"))  //button[@id='add-to-cart-sauce-labs-bolt-t-shirt' and @name='add-to-cart-sauce-labs-bolt-t-shirt']
      await removeToCart.click()

      // Assert the cart badge current value
      // Wait for the add to cart increment value
      let totalOfAddedToCart = await driver.wait(until.elementLocated(By.xpath("//span[@data-test='shopping-cart-badge']")), 5000)
      await driver.wait(until.elementIsVisible(totalOfAddedToCart), 5000)

      // Get the total, in this case this should be two (2)
      let addedToCartText = await driver.findElement(By.xpath("//span[@data-test='shopping-cart-badge']"))
      assert.equal(await addedToCartText.getText(), 1, "Cart badge should be 1 after removing one product to cart")
      
    })

    it("Verify if the specific product is the same after clicking the title", async () => {

    })

    it("Verify if add to cart and remove button are working on a specific product and verify the cart badge if incrementing or decrementing", async () => {
      
    })

    it("Verify if the cart is resetting and if the 'Remove' button reverts to 'Add to cart' once the user logs out", async () => {
      
      await verifyUrl("https://www.saucedemo.com/inventory.html") // Note, feel free to change to test assertion

      // Re-add to cart the removed product
      await driver.wait(until.elementLocated(By.id("add-to-cart-sauce-labs-bolt-t-shirt")), 2000)
      let firstAddToCart = await driver.findElement(By.id("add-to-cart-sauce-labs-bolt-t-shirt"))  //button[@id='add-to-cart-sauce-labs-bolt-t-shirt' and @name='add-to-cart-sauce-labs-bolt-t-shirt']
      await firstAddToCart.click()

      // Click the burger menu to click the link
      await driver.findElement(By.id("react-burger-menu-btn")).click()

      // Wait for the link to show up
      let menuWrapElement = await driver.wait(until.elementLocated(By.className("bm-menu-wrap")), 5000);
      await driver.wait(until.elementIsVisible(menuWrapElement), 5000)

      // Get the value of the aria-hidden attribute
      let ariaHiddenValue = await menuWrapElement.getAttribute("aria-hidden");

      if(ariaHiddenValue != "true"){
        // Click logout link
        await driver.wait(until.elementLocated(By.id("logout_sidebar_link")), 2000)
        let logoutLink = await driver.findElement(By.id("logout_sidebar_link"))
        await logoutLink.click()

        // Assert if logout successfully, should redirect to login page
        await verifyUrl("https://www.saucedemo.com/") // Note, feel free to change to test assertion
      }
      else{
        console.log("Ooops. Sidebar is hidden.")
      }

      // Relogin the standard_user
      await driver.findElement(By.id("user-name")).sendKeys("standard_user");
      await driver.findElement(By.id("password")).sendKeys("secret_sauce");
      await driver.findElement(By.id("login-button")).click();
      await driver.wait(until.urlIs("https://www.saucedemo.com/inventory.html"), 10000); // Wait until redirected to inventory page

      await verifyUrl("https://www.saucedemo.com/inventory.html") // Note, feel free to change to test assertion

      // Check two products remove button
      await driver.wait(until.elementLocated(By.id("remove-test.allthethings()-t-shirt-(red)")), 2000)
      await driver.wait(until.elementLocated(By.id("remove-sauce-labs-bolt-t-shirt")), 2000)

      let firstProduct = await driver.findElement(By.id("remove-test.allthethings()-t-shirt-(red)"))
      let secondProduct = await driver.findElement(By.id("remove-sauce-labs-bolt-t-shirt"))

      // Assert the button text if Remove
      assert.strictEqual(await firstProduct.getText(), "Remove")
      assert.strictEqual(await secondProduct.getText(), "Remove")

      // Wait for the add to cart increment value
      let totalOfAddedToCart = await driver.wait(until.elementLocated(By.xpath("//span[@data-test='shopping-cart-badge']")), 5000)
      await driver.wait(until.elementIsVisible(totalOfAddedToCart), 5000)

      // Get the total, in this case this should be two (2)
      let addedToCartText = await driver.findElement(By.xpath("//span[@data-test='shopping-cart-badge']"))
      assert.equal(await addedToCartText.getText(), 2, "Cart badge should be 2")

    })

  })
})