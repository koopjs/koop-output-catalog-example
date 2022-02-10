const outputCustomCatalog = require('./output-custom-catalog/initialize')();
const koopProviderHubSearch = require('./koop-provider-hub-search/initialize')();
const outputs = [outputCustomCatalog];
const auths = [];
const caches = [];
const plugins = [koopProviderHubSearch];
module.exports = [...outputs, ...auths, ...caches, ...plugins];