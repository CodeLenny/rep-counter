const { composePlugins, withNx } = require("@nrwl/webpack");
const { withReact } = require("@nrwl/react");

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), withReact(), (config) => {
  // Update the webpack config as needed here.
  // e.g. `config.plugins.push(new MyPlugin())`
  if (!config.resolve) {
    config.resolve = {};
  }
  if (!config.resolve.fallback) {
    config.resolve.fallback = {};
  }
  config.resolve.fallback["util"] = false;
  return config;
});
