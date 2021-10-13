import config from "@softvisio/vue/resources/webpack.config.firebase-worker.js";

config.resolve.alias = {
    ...config.resolve.alias,
    "#vue": "@softvisio/vue-ext",
};

export default config;
