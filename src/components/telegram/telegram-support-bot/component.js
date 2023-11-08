import app from "#app";
import TelegramBotComponent from "#src/components/telegram/bot/component";

class Component extends TelegramBotComponent {

    // propertirs
    get id () {
        return "telegramSupportBot";
    }

    get name () {
        return app.locale.l10n( "Notifications bot" );
    }

    get shortDescription () {
        return super.shortDescription;
    }

    get description () {
        return `Application notifications bot. For internal use pnly.`;
    }

    get panel () {
        return import( /* webpackChunkName: "telegram-support-bot" */ "./panel" );
    }
}

export default new Component();
