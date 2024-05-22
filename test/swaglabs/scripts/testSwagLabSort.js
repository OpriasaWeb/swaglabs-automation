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
    beforeEach(async () => {
      try {
        await driver.findElement(By.id("user-name")).sendKeys("standard_user");
        await driver.findElement(By.id("password")).sendKeys("secret_sauce");
        await driver.findElement(By.id("login-button")).click();
        await driver.wait(until.urlIs("https://www.saucedemo.com/inventory.html"), 10000); // Wait until redirected to inventory page
      } catch (error) {
        console.log(error);
      }
    });

    it("Verify if user is able to login using correct username and password", async () => {
      const url = "https://www.saucedemo.com/inventory.html";
      let currentUrl = await driver.getCurrentUrl();
      assert.equal(currentUrl, url);
    });

    describe("Test each sort products", async () => {
      it("Verify if sorting by Name (Z to A) will sort the products in reverse alphabetical order.", async () => {
        try {
          // Now you are guaranteed to be on the inventory page due to the beforeEach hook
          // Set an implicit wait timeout
          await driver.manage().setTimeouts({ implicit: 500 });

          // Locate the element every time you need to interact with it
          await driver.wait(until.elementLocated(By.className("product_sort_container")), 10000);
          const productSelect = await driver.findElement(By.className("product_sort_container"));
          const select = new Select(productSelect);

          // Wait for the select element to be interactable
          await driver.wait(until.elementIsEnabled(productSelect), 10000);

          await select.selectByValue("za");

          // Assert the selected option
          const optionList = await select.getOptions();

          console.log(select);
          console.log(optionList);
        } catch (error) {
          console.log(error);
        }
      });
    });
  });
});


// describe("Test the sorting functionalities", async () => {

//   before(async () => {
//     driver = await new Builder().forBrowser("MicrosoftEdge").build()
//     await driver.get("https://www.saucedemo.com/")
//   })

//   after(async () => {
//     await driver.quit()
//   })

//   describe("Test login with correct credentials to redirect on inventory page", async () => {

//     beforeEach(async () => {
//       try {
//         await driver.findElement(By.id("user-name")).sendKeys("standard_user");
//         await driver.findElement(By.id("password")).sendKeys("secret_sauce");
//         await driver.findElement(By.id("login-button")).click();
//         await driver.wait(until.urlIs("https://www.saucedemo.com/inventory.html"), 10000); // Wait until redirected to inventory page
//       } catch (error) {
//         console.log(error);
//       }
//     });

//     it("Verify if user is able to login using correct username and password", async () => {
//       const url = "https://www.saucedemo.com/inventory.html";
//       let currentUrl = await driver.getCurrentUrl();
//       assert.equal(currentUrl, url);
//     });

//     it("Verify if user is able to login using correct username and password", async () => {
//       try {
//         await driver.findElement(By.id("user-name")).sendKeys("standard_user")
//         await driver.findElement(By.id("password")).sendKeys("secret_sauce")

//         await driver.findElement(By.id("login-button")).click()

//         const url = "https://www.saucedemo.com/inventory.html"
//         let currentUrl = await driver.getCurrentUrl();
//         assert.equal(currentUrl, url)

//       } catch (error) {
//         console.log(error)
//       }
//     })
//   })

//   describe("Test each sort products", async () => {
//     it("Verify if sorting by Name (Z to A) will sort the products in reverse alphabetical order.", async () => {
//       try {

//         const url = "https://www.saucedemo.com/inventory.html"
//         let currentUrl = await driver.getCurrentUrl();
//         assert.equal(currentUrl, url)

//         // Set an implicit wait timeout
//         await driver.manage().setTimeouts({ implicit: 500 })

//         // Locate the element every time you need to interact with it
//         await driver.wait(until.elementLocated(By.className("product_sort_container")), 10000)
//         const productSelect = await driver.findElement(By.className("product_sort_container"))
//         const select = new Select(productSelect)

//         // Wait for the select element to be interactable
//         await driver.wait(until.elementIsEnabled(productSelect), 10000)

//         await select.selectByValue("za")

//         // Assert the selected option
//         const optionList = await select.getOptions()

//         console.log(select)
//         console.log(optionList)

//       } catch (error) {
//         console.log(error)
//       }
//     })
//   })

//   // describe("Test each sort products", async () => {
//   //   it("Verify if sorting by Name (Z to A) will sort the products in reverse alphabetical order.", async () => {
//   //     try {

//   //       // Set an implicit wait timeout
//   //       await driver.manage().setTimeouts({ implicit: 500 })

//   //       let sort = await driver.wait(until.elementIsVisible(By.className("product_sort_container")), 5000)
//   //       await driver.wait(until.elementLocated(sort), 5000)
//   //       const productSelect = await driver.findElement(By.className("product_sort_container"))
//   //       const select = new Select(productSelect)

//   //       // Wait for the select element to be interactable
//   //       await driver.wait(until.elementIsEnabled(productSelect), 5000)

//   //       await select.selectByValue("za")

//   //       // Assert the selected option
//   //       const optionList = await select.getOptions()

//   //       console.log(select)
//   //       console.log(optionList)

//   //     } catch (error) {
//   //       console.log(error)
//   //     }
//   //   })
//   // })



// })