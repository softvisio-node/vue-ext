import L10n from "@softvisio/vue/l10n";

export default class extends L10n {

    // protected
    async _loadLocale ( locale ) {
        return import( "#resources/l10n/" + locale + ".js" );
    }
}
