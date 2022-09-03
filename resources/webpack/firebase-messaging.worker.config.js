import config from "@softvisio/vue/resources/webpack/firebase-messaging.worker.config.js";

config.get( "firebaseMessagingWorker" ).wrap( ( config, options ) => {
    config.resolve.alias = {
        ...config.resolve.alias,
        "#vue": "@softvisio/vue-ext",
    };

    return config;
} );

export default config;
