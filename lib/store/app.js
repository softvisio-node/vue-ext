import Store from "@softvisio/vue/lib/store/app";
import Theme from "./theme";

export default class extends Store {
    modules () {
        var cfg = super.modules() || {};

        cfg.theme = Theme;

        return cfg;
    }
}
