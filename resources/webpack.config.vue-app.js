import config from "@softvisio/vue/resources/webpack.config.vue-app.js";

config.resolve.alias["#vue"] = "@softvisio/vue";

config.modules[1].exclude.push( /[\\/]resources[\\/]ext-[\d.]+[\\/]/, /[\\/]resources[\\/]ewc-[\d.]+[\\/]/ );

export default config;
