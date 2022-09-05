import { FirebaseMessagingWorker as Super } from "@softvisio/vue/resources/webpack/firebase-messaging.worker.config.js";

export class FirebaseMessagingWorker extends Super {

    // public
    generate ( options ) {
        const config = super.generate( options );

        config.resolve.alias = {
            ...config.resolve.alias,
            "#vue": "@softvisio/vue-ext",
        };

        return config;
    }
}
