import L10n from "@softvisio/vue";

export default class extends L10n {

    // protected
    async _loadLocale ( locale ) {
        return import( "#resources/l10n/" + locale + ".js" );
    }
}
