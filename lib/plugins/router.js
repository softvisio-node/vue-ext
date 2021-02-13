import Router from "../router";

export default {
    install ( app, options ) {
        app.config.globalProperties.$router = new Router();
    },
};
