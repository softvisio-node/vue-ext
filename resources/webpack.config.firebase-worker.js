import { config, schema } from "@softvisio/vue/resources/webpack.config.firebase-worker.js";

config.resolve.alias = {
    ...config.resolve.alias,
    "#vue": "@softvisio/vue-ext",
};

export { config, schema };
