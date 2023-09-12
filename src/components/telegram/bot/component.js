import telegramRegistry from "#src/components/telegram/registry";

export default class TelegramBotComponent {
    constructor () {
        telegramRegistry.registerBotType( this );
    }

    // propertirs
    get type () {
        throw `Bot type is reqiored`;
    }

    get name () {
        throw `Bot name is reqiored`;
    }

    get description () {
        return this.name;
    }

    get panel () {
        return import( "./panel" );
    }
}
