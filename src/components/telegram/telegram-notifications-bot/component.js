import app from "#app";
import TelegramBotComponent from "#src/components/telegram/bot/component";

class Component extends TelegramBotComponent {

    // propertirs
    get id () {
        return "telegramNotificationsBot";
    }

    get name () {
        return app.locale.l10n( "Notifications bot" );
    }

    get panel () {
        return import( /* webpackChunkName: "telegram-notifications-bot" */ "./panel" );
    }
}

export default new Component();
