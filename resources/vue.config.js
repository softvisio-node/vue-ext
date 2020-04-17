const config = require( "@softvisio/vue/resources/vue.config" );

config.configureWebpack = ( config ) => {
    // aliases
    config.resolve.alias["#ext.js"] = "@softvisio/ext/lib/ext-" + process.env.EXT_VERSION + ".js";
    config.resolve.alias["#ewc.js"] = "@softvisio/ext/lib/ewc-" + process.env.EWC_VERSION + ".js";
    config.resolve.alias["#softvisio"] = "@softvisio/vue-ext/lib";
};

module.exports = config;
