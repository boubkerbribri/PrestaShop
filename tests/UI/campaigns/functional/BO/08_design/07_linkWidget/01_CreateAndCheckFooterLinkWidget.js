require('module-alias/register');

const {expect} = require('chai');

// Import utils
const helper = require('@utils/helpers');
const loginCommon = require('@commonTests/loginBO');

// Import pages
const LoginPage = require('@pages/BO/login');
const DashboardPage = require('@pages/BO/dashboard');
const LinkWidgetsPage = require('@pages/BO/design/linkWidgets');
const AddLinkWidgetPage = require('@pages/BO/design/linkWidgets/add');
const FOBasePage = require('@pages/FO/FObasePage');

// Import data
const {LinkWidgets} = require('@data/demo/linkWidgets');
const {hooks} = require('@data/demo/hooks');

// Import test context
const testContext = require('@utils/testContext');

const baseContext = 'functional_BO_design_linkWidget_createAndCheckFooterLInkWidget';


let browserContext;
let page;
let numberOfLinkWidgetInFooter = 0;

// Init objects needed
const init = async function () {
  return {
    loginPage: new LoginPage(page),
    dashboardPage: new DashboardPage(page),
    linkWidgetsPage: new LinkWidgetsPage(page),
    addLinkWidgetPage: new AddLinkWidgetPage(page),
    foBasePage: new FOBasePage(page),
  };
};
/*
Create link widget
Check existence in FO
Delete link widget created
 */
describe('Create footer link widget and check it in FO', async () => {
  // before and after functions
  before(async function () {
    browserContext = await helper.createBrowserContext(this.browser);
    page = await helper.newTab(browserContext);

    this.pageObjects = await init();
  });

  after(async () => {
    await helper.closeBrowserContext(browserContext);
  });

  // Login into BO
  loginCommon.loginBO();

  it('should go to link Widget page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToLinkWidgetPage', baseContext);

    await this.pageObjects.dashboardPage.goToSubMenu(
      this.pageObjects.dashboardPage.designParentLink,
      this.pageObjects.dashboardPage.linkWidgetLink,
    );

    await this.pageObjects.linkWidgetsPage.closeSfToolBar();

    const pageTitle = await this.pageObjects.linkWidgetsPage.getPageTitle();
    await expect(pageTitle).to.contains(this.pageObjects.linkWidgetsPage.pageTitle);
  });

  describe('Create link widget', async () => {
    it('should go to add new link widget page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToNewLinkWidgetPage', baseContext);

      await this.pageObjects.linkWidgetsPage.goToNewLinkWidgetPage();
      const pageTitle = await this.pageObjects.addLinkWidgetPage.getPageTitle();
      await expect(pageTitle).to.contains(this.pageObjects.addLinkWidgetPage.pageTitle);
    });

    it('should create link widget', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'createFooterLInkWidget', baseContext);

      const textResult = await this.pageObjects.addLinkWidgetPage.addLinkWidget(LinkWidgets.demo_1);
      await expect(textResult).to.equal(this.pageObjects.linkWidgetsPage.successfulCreationMessage);

      numberOfLinkWidgetInFooter = await this.pageObjects.linkWidgetsPage.getNumberOfElementInGrid(
        hooks.displayFooter.id,
      );
      await expect(numberOfLinkWidgetInFooter).to.be.above(0);
    });
  });

  describe('Go to FO and check existence of link Widget created', async () => {
    it('should go to FO and check link widget in home page footer', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkLinkWidgetInFO', baseContext);

      // View shop
      page = await this.pageObjects.linkWidgetsPage.viewMyShop();
      this.pageObjects = await init();

      // Change FO language
      await this.pageObjects.foBasePage.changeLanguage('en');
      const title = await this.pageObjects.foBasePage.getFooterLinksBlockTitle(numberOfLinkWidgetInFooter);
      await expect(title).to.contains(LinkWidgets.demo_1.name);

      const linksTextContent = await this.pageObjects.foBasePage.getFooterLinksTextContent(numberOfLinkWidgetInFooter);

      await Promise.all([
        expect(linksTextContent).to.include.members(LinkWidgets.demo_1.contentPages),
        expect(linksTextContent).to.include.members(LinkWidgets.demo_1.productsPages),
        expect(linksTextContent).to.include.members(LinkWidgets.demo_1.staticPages),
        expect(linksTextContent).to.include.members(LinkWidgets.demo_1.customPages.map(el => el.name)),
      ]);

      // Go back to BO
      page = await this.pageObjects.foBasePage.closePage(browserContext, 0);
      this.pageObjects = await init();
    });
  });

  describe('Delete link widget created', async () => {
    it('should delete link widget created', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'deleteLinkWidget', baseContext);

      const textResult = await this.pageObjects.linkWidgetsPage.deleteLinkWidget(
        hooks.displayFooter.id,
        numberOfLinkWidgetInFooter,
      );

      await expect(textResult).to.equal(this.pageObjects.linkWidgetsPage.successfulDeleteMessage);

      const numberOfLinkWidgetAfterDelete = await this.pageObjects.linkWidgetsPage.getNumberOfElementInGrid(
        hooks.displayFooter.id,
      );

      await expect(numberOfLinkWidgetAfterDelete).to.equal(numberOfLinkWidgetInFooter - 1);
    });
  });
});
