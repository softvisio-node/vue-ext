import TelegramBotComponent from "#src/components/telegram/bot/component";

class Component extends TelegramBotComponent {

    // propertirs
    get id () {
        return "telegramSupportBot";
    }

    get name () {
        return l10n( "Project support bot" );
    }

    get shortDescription () {
        return super.shortDescription;
    }

    get description () {
        return l10n( `Project support bot. For internal use only.` );
    }

    get panel () {
        return import( /* webpackChunkName: "telegram-support-bot" */ "./panel" );
    }
}

export default new Component();
