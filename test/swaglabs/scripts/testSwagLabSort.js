const { By, Builder, until, Key } = require("selenium-webdriver")
const { Select } = require("selenium-webdriver/lib/select")
const assert = require("assert")

describe("Test the sorting functionalities", async () => {
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


  describe("Test each sort products", async () => {

    it("Verify if sorting by Name (Z to A) will sort the products in reverse alphabetical order", async () => {
      try {
        // Now you are guaranteed to be on the inventory page due to the beforeEach hook
        // Set an implicit wait timeout
        await driver.manage().setTimeouts({ implicit: 500 });

        const url = "https://www.saucedemo.com/inventory.html";
        let currentUrl = await driver.getCurrentUrl();
        assert.equal(currentUrl, url);

        const pageTitle = "Swag Labs";
        let currentPage = await driver.getTitle()
        assert.equal(currentPage, pageTitle)

        // Locate the sort dropdown
        let sortDropdown = await driver.wait(until.elementLocated(By.className("product_sort_container")), 5000)
        await driver.wait(until.elementIsVisible(sortDropdown), 5000)

        // Create a select instance
        let selectSort = new Select(sortDropdown)
        await selectSort.selectByVisibleText("Name (Z to A)")

        // Verify the products are sorted in reverse alphabetical order
        // Fetch all product names
        let productElements = await driver.findElements(By.className("inventory_item_name"))
        let productNames = []
        for (let productElement of productElements) {
          productNames.push(await productElement.getText())
        }

        // Copy the array and sort it for comparison
        let sortedProductNames = [...productNames].sort().reverse()
        assert.deepEqual(productNames, sortedProductNames)
  
      } catch (error) {
        console.log(error);
      }
    });

    it("Verify if sorting by Name (A to Z) will sort the products in alphabetical order", async () => {
      try {
        // Now you are guaranteed to be on the inventory page due to the beforeEach hook
        // Set an implicit wait timeout
        await driver.manage().setTimeouts({ implicit: 500 });

        const url = "https://www.saucedemo.com/inventory.html";
        let currentUrl = await driver.getCurrentUrl();
        assert.equal(currentUrl, url);

        const pageTitle = "Swag Labs";
        let currentPage = await driver.getTitle()
        assert.equal(currentPage, pageTitle)

        // Locate the sort dropdown
        let sortDropdown = await driver.wait(until.elementLocated(By.className("product_sort_container")), 5000)
        await driver.wait(until.elementIsVisible(sortDropdown), 5000)

        // Create a select instance
        let selectSort = new Select(sortDropdown)
        await selectSort.selectByVisibleText("Name (A to Z)")

        // Verify the products are sorted in alphabetical order
        // Fetch all product names
        let productElements = await driver.findElements(By.className("inventory_item_name"))
        let productNames = []
        for (let productElement of productElements) {
          productNames.push(await productElement.getText())
        }

        // Copy the array and sort it for comparison
        let sortedProductNames = [...productNames].sort()
        assert.deepEqual(productNames, sortedProductNames)
  
      } catch (error) {
        console.log(error);
      }
    });

    it("Verify if sorting by Price (low to high) will sort the products from lower to higher order", async () => {
      try {
        // Now you are guaranteed to be on the inventory page due to the beforeEach hook
        // Set an implicit wait timeout
        await driver.manage().setTimeouts({ implicit: 500 });

        const url = "https://www.saucedemo.com/inventory.html";
        let currentUrl = await driver.getCurrentUrl();
        assert.equal(currentUrl, url);

        const pageTitle = "Swag Labs";
        let currentPage = await driver.getTitle()
        assert.equal(currentPage, pageTitle)

        // Locate the sort dropdown
        let sortDropdown = await driver.wait(until.elementLocated(By.className("product_sort_container")), 5000)
        await driver.wait(until.elementIsVisible(sortDropdown), 5000)

        // Create a select instance
        let selectSort = new Select(sortDropdown)
        await selectSort.selectByVisibleText("Price (low to high)")

        // Verify the products are sorted in low to high order
        // Fetch all product names
        let productElements = await driver.findElements(By.className("inventory_item_name"))
        let productNames = []
        for (let productElement of productElements) {
          productNames.push(await productElement.getText())
        }

        // Copy the array and sort it for comparison
        let sortedProductNames = [...productNames]
        assert.deepEqual(productNames, sortedProductNames)
  
      } catch (error) {
        console.log(error);
      }
    });

    it("Verify if sorting by Price (high to low) will sort the products from higher to lower order", async () => {
      try {
        // Now you are guaranteed to be on the inventory page due to the beforeEach hook
        // Set an implicit wait timeout
        await driver.manage().setTimeouts({ implicit: 500 });

        const url = "https://www.saucedemo.com/inventory.html";
        let currentUrl = await driver.getCurrentUrl();
        assert.equal(currentUrl, url);

        const pageTitle = "Swag Labs";
        let currentPage = await driver.getTitle()
        assert.equal(currentPage, pageTitle)

        // Locate the sort dropdown
        let sortDropdown = await driver.wait(until.elementLocated(By.className("product_sort_container")), 5000)
        await driver.wait(until.elementIsVisible(sortDropdown), 5000)

        // Create a select instance
        let selectSort = new Select(sortDropdown)
        await selectSort.selectByVisibleText("Price (high to low)")

        // Verify the products are sorted in low to high order
        // Fetch all product names
        let productElements = await driver.findElements(By.className("inventory_item_name"))
        let productNames = []
        for (let productElement of productElements) {
          productNames.push(await productElement.getText())
        }

        // Copy the array and sort it for comparison
        let sortedProductNames = [...productNames]
        assert.deepEqual(productNames, sortedProductNames)
  
      } catch (error) {
        console.log(error);
      }
    });


  });

});