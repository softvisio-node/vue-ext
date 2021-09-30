import config from "@softvisio/vue/resources/webpack.config.vue-app.js";

config.resolve.alias["#vue"] = "@softvisio/vue-ext";

// config.module.rules[1].exclude.push( /[\\/]resources[\\/]ext-[\d.]+[\\/]/, /[\\/]resources[\\/]ewc-[\d.]+[\\/]/ );

config.optimization.splitChunks.cacheGroups["ext"] = {
    "name": "ext",
    "test": /[\\/]softvisio-ext[\\/]/,
    "priority": -10,
    "chunks": "initial",
};

export default config;
