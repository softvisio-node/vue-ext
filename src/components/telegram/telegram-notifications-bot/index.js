import telegramRegistry from "#src/components/telegram/registry";

telegramRegistry.registerBotType( "telegramNotificationsBot", () => import( /* webpackChunkName: "telegram-notifications-bot" */ "./panel" ) );
