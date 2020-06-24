import Store from "@softvisio/vue/store/main";
import Theme from "./theme";

export default class extends Store {
    modules () {
        var cfg = super.modules() || {};

        if ( !cfg.theme ) cfg.theme = Theme;

        return cfg;
    }
}
