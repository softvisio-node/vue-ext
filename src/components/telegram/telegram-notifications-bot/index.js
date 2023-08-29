import registry from "#src/components/telegram/registry";

registry.register( "telegramNotificationsBot", () => import( "#src/components/telegram/bot/panel" ) );
