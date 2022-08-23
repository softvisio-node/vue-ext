import config from "@softvisio/vue/resources/webpack/firebase.worker.config.js";

config.resolve.alias = {
    ...config.resolve.alias,
    "#vue": "@softvisio/vue-ext",
};

export default config;
