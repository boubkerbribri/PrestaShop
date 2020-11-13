module.exports = {
  ThemeCatalog: {
    discover_all_of_the_theme_button: '//a[contains(text(), "Discover all of the themes")]',
    category_name_text: '//*[@id="category_name"]',
    discover_button: '(//p[contains(text(), "Discover")])[%POS]',
    theme_name: '(//a[contains(@class, "addons-theme-product-link")])[%POS]',
    search_addons_input: '//*[@id="addons-search-box"]',

    //Selectors in addons.prestashop.com site
    search_name: '//*[@id="search_name"]/b',
    theme_header_name: '//h1[@id="product_title"]'
  }
};
