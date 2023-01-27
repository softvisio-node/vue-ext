import { FirebaseMessagingWorker as Super } from "@softvisio/vue/webpack/firebase-messaging.worker";

export class FirebaseMessagingWorker extends Super {

    // properties
    get resolveAlias () {
        return {
            ...super.resolveAlias,
            "#vue": "@softvisio/vue-ext",
        };
    }
}
