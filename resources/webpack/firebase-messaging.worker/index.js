import { FirebaseMessagingWorker as Super } from "@softvisio/vue/webpack/firebase-messaging.worker";

export class FirebaseMessagingWorker extends Super {

    // protected
    _generate ( options ) {
        const config = super._generate( options );

        config.resolve.alias = {
            ...config.resolve.alias,
            "#vue": "@softvisio/vue-ext",
        };

        return config;
    }
}
