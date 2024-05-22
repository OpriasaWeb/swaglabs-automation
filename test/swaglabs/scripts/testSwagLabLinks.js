const { By, Builder, until, Key } = require("selenium-webdriver")
const assert = require("assert")

describe("Test swag lab links", async () => {
  before(async () => {
    driver = await new Builder().forBrowser("MicrosoftEdge").build();
    await driver.get("https://www.saucedemo.com/");
  });

  // after(async () => {
  //   await driver.quit();
  // });

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

  describe("Test swag lab links", async () => {
    it("Verify if All Items link will provide all items available in the products", async () => {

      const url = "https://www.saucedemo.com/inventory.html";
      let currentUrl = await driver.getCurrentUrl();
      assert.equal(currentUrl, url);

      const pageTitle = "Swag Labs";
      let currentPage = await driver.getTitle()
      assert.equal(currentPage, pageTitle)

      // Locate the cart icon
      let cartIcon = await driver.wait(until.elementLocated(By.xpath("//a[@data-test='shopping-cart-link']")), 5000)
      await driver.wait(until.elementIsVisible(cartIcon), 5000)

      // Click the cart icon
      await driver.findElement(By.xpath("//a[@data-test='shopping-cart-link']")).click()

      const secondUrl = "https://www.saucedemo.com/cart.html";
      let getSecondUrl = await driver.getCurrentUrl();
      assert.equal(getSecondUrl, secondUrl);

      // Click the burger menu to click the link
      await driver.findElement(By.id("react-burger-menu-btn")).click()

      // Wait for the link to show up
      let menuWrapElement = await driver.wait(until.elementLocated(By.className("bm-menu-wrap")), 5000);
      await driver.wait(until.elementIsVisible(menuWrapElement), 5000)

      // Get the value of the aria-hidden attribute
      let ariaHiddenValue = await menuWrapElement.getAttribute("aria-hidden");

      // Navigation link so far
      let linkArray = ['All Items', 'About', 'Logout', 'Reset App State']

      if(ariaHiddenValue != "true"){
        let navigationList = await driver.findElement(By.className("bm-item-list"))
        let navigationNames = [] // will store all the links name here for assertion

        // Find all <a> elements within the <nav> element
        let anchorElements = await navigationList.findElements(By.className("bm-item"));

        // Store the link name to navigationNames variable array
        for(let anchorElement of anchorElements){
          navigationNames.push(await anchorElement.getText())
        }

        // Assert the link texts
        for(let i = 0; i < navigationNames.length; i++){
          assert.deepEqual(linkArray[i], navigationNames[i])
        }

        await driver.findElement(By.id("inventory_sidebar_link")).click()

        // Assert if the page will redirect to inventory
        const url = "https://www.saucedemo.com/inventory.html";
        let currentUrl = await driver.getCurrentUrl();
        assert.equal(currentUrl, url);

        // Check also the products sorted to A-Z alphabetically
        // Fetch all product names
        let productElements = await driver.findElements(By.className("inventory_item_name"))
        let productNames = []
        for (let productElement of productElements) {
          productNames.push(await productElement.getText())
        }

        // Copy the array and sort it for comparison
        let sortedProductNames = [...productNames].sort()
        assert.deepEqual(productNames, sortedProductNames)
      }
    })

    it("Verify if Reset App State will reset the app state itself or the current form of the app", async () => {

      // Add to cart button
      await driver.findElement(By.id("add-to-cart-sauce-labs-backpack")).click()
      await driver.findElement(By.id("add-to-cart-sauce-labs-bike-light")).click()

      // Wait for the add to cart increment value
      let totalOfAddedToCart = await driver.wait(until.elementLocated(By.xpath("//span[@data-test='shopping-cart-badge']")), 5000)
      await driver.wait(until.elementIsVisible(totalOfAddedToCart), 5000)

      // Get the total, in this case this should be two (2)
      let addedToCartText = await driver.findElement(By.xpath("//span[@data-test='shopping-cart-badge']"))
      assert.equal(await addedToCartText.getText(), 2, "Cart badge should be 2")

      // Click the burger menu to click the link
      await driver.findElement(By.id("react-burger-menu-btn")).click()

      // Wait for the link to show up
      let menuWrapElement = await driver.wait(until.elementLocated(By.className("bm-menu-wrap")), 10000);
      await driver.wait(until.elementIsVisible(menuWrapElement), 10000)

      let ariaHiddenValue = await menuWrapElement.getAttribute("aria-hidden");
      if(ariaHiddenValue != "true"){
        // Now, click the reset app state and close the sidebar
        await driver.wait(until.elementLocated(By.id("reset_sidebar_link")), 5000)
        await driver.wait(until.elementLocated(By.id("react-burger-cross-btn")), 5000)

        let resetAppState = await driver.findElement(By.id("reset_sidebar_link"))

        await resetAppState.click()

      }
    })

    it("Verify if user is able to log out", async () => {

      await driver.findElement(By.id("logout_sidebar_link")).click()

      // Assert if the page will redirect to login
      const url = "https://www.saucedemo.com/";
      let currentUrl = await driver.getCurrentUrl();
      assert.equal(currentUrl, url);

    })

    it("Verify if about link will redirect to https://saucelabs.com/", async () => {

      // Relog-in user with correct credentials
      await driver.findElement(By.id("user-name")).sendKeys("standard_user");
      await driver.findElement(By.id("password")).sendKeys("secret_sauce");
      await driver.findElement(By.id("login-button")).click();
      await driver.wait(until.urlIs("https://www.saucedemo.com/inventory.html"), 10000); // Wait until redirected to inventory page

      const url = "https://www.saucedemo.com/inventory.html";
      let currentUrl = await driver.getCurrentUrl();
      assert.equal(currentUrl, url);

      // Click the burger menu to click the link
      await driver.findElement(By.id("react-burger-menu-btn")).click()

      // Wait for the link to show up
      let menuWrapElement = await driver.wait(until.elementLocated(By.className("bm-menu-wrap")), 5000);
      await driver.wait(until.elementIsVisible(menuWrapElement), 5000)

      // Get the value of the aria-hidden attribute
      let ariaHiddenValue = await menuWrapElement.getAttribute("aria-hidden");

      if(ariaHiddenValue != "true"){
        await driver.wait(until.elementLocated(By.id("about_sidebar_link")), 5000)

        let aboutPage = await driver.findElement(By.id("about_sidebar_link"))

        await aboutPage.click()

        // Assert if the page will redirect to about or saucelabs
        const urlAbout = "https://saucelabs.com/";
        let currentUrlAbout = await driver.getCurrentUrl();
        assert.equal(currentUrlAbout, urlAbout, "Redirects to about page of saucelabs");
      }
      
    })
  })

})