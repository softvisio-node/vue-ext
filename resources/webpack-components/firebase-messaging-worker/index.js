import WebpackComponent from "@softvisio/vue/webpack-components/firebase-messaging-worker";

export default class extends WebpackComponent {

    // properties
    get resolveAlias () {
        return {
            ...super.resolveAlias,
            "#vue": "@softvisio/vue-ext",
        };
    }
}
