require('module-alias/register');
// Using chai
const {expect} = require('chai');
const helper = require('@utils/helpers');
const loginCommon = require('@commonTests/loginBO');
// Importing pages
const BOBasePage = require('@pages/BO/BObasePage');
const LoginPage = require('@pages/BO/login');
const DashboardPage = require('@pages/BO/dashboard');
const StocksPage = require('@pages/BO/catalog/stocks');
// Importing data
const demoProductsData = require('@data/demo/products');

let browser;
let page;
let numberOfProducts = 0;

// Init objects needed
const init = async function () {
  return {
    boBasePage: new BOBasePage(page),
    loginPage: new LoginPage(page),
    dashboardPage: new DashboardPage(page),
    stocksPage: new StocksPage(page),
  };
};

// Filter And Quick Edit Stocks
describe('Filter And Quick Edit Stocks', async () => {
  // before and after functions
  before(async function () {
    browser = await helper.createBrowser();
    page = await helper.newTab(browser);
    this.pageObjects = await init();
  });
  after(async () => {
    await helper.closeBrowser(browser);
  });
  // Login into BO and go to categories page
  loginCommon.loginBO();

  it('should go to "Catalog>Stocks" page', async function () {
    await this.pageObjects.boBasePage.goToSubMenu(
      this.pageObjects.boBasePage.catalogParentLink,
      this.pageObjects.boBasePage.stocksLink,
    );
    await this.pageObjects.boBasePage.closeSfToolBar();
    const pageTitle = await this.pageObjects.stocksPage.getPageTitle();
    await expect(pageTitle).to.contains(this.pageObjects.stocksPage.pageTitle);
  });

  it('should get number of products in list', async function () {
    numberOfProducts = await this.pageObjects.stocksPage.getNumberOfProductsFromList();
    await expect(numberOfProducts).to.be.above(0);
  });

  // 1 : Filter products with name, reference, supplier
  describe('Filter products', async () => {
    it('should filter by name \'Customizable mug\'', async function () {
      await this.pageObjects.stocksPage.simpleFilter(
        demoProductsData.Products.demo_1.name,
      );
      const numberOfProductsAfterFilter = await this.pageObjects.stocksPage.getNumberOfProductsFromList();
      await expect(numberOfProductsAfterFilter).to.be.at.most(numberOfProducts);
      for (let i = 1; i <= numberOfProductsAfterFilter; i++) {
        const textColumn = await this.pageObjects.stocksPage.getTextContent(
          this.pageObjects.stocksPage.productRowNameColumn.replace('%ROW', i));
        await expect(textColumn).to.contains(demoProductsData.Products.demo_1.name);
      }
    });

    it('should reset all filters', async function () {
      const numberOfProductsAfterReset = await this.pageObjects.stocksPage.resetFilter();
      await expect(numberOfProductsAfterReset).to.equal(numberOfProducts);
    });

    it('should filter by reference \'demo_1\'', async function () {
      await this.pageObjects.stocksPage.simpleFilter(
        demoProductsData.Products.demo_1.reference,
      );
      const numberOfProductsAfterFilter = await this.pageObjects.stocksPage.getNumberOfProductsFromList();
      await expect(numberOfProductsAfterFilter).to.be.at.most(numberOfProducts);
      for (let i = 1; i <= numberOfProductsAfterFilter; i++) {
        const textColumn = await this.pageObjects.stocksPage.getTextContent(
          this.pageObjects.stocksPage.productRowReferenceColumn.replace('%ROW', i));
        await expect(textColumn.toLowerCase()).to.contains(demoProductsData.Products.demo_1.reference);
      }
    });

    it('should reset all filters', async function () {
      const numberOfProductsAfterReset = await this.pageObjects.stocksPage.resetFilter();
      await expect(numberOfProductsAfterReset).to.equal(numberOfProducts);
    });

    it('should filter by supplier \'N/A\'', async function () {
      await this.pageObjects.stocksPage.simpleFilter(
        demoProductsData.Products.demo_1.supplier,
      );
      const numberOfProductsAfterFilter = await this.pageObjects.stocksPage.getNumberOfProductsFromList();
      await expect(numberOfProductsAfterFilter).to.be.at.most(numberOfProducts);
      for (let i = 1; i <= numberOfProductsAfterFilter; i++) {
        const textColumn = await this.pageObjects.stocksPage.getTextContent(
          this.pageObjects.stocksPage.productRowSupplierColumn.replace('%ROW', i));
        await expect(textColumn).to.contains(demoProductsData.Products.demo_1.supplier);
      }
    });

    it('should reset all filters', async function () {
      const numberOfProductsAfterReset = await this.pageObjects.stocksPage.resetFilter();
      await expect(numberOfProductsAfterReset).to.equal(numberOfProducts);
    });
  });
});

