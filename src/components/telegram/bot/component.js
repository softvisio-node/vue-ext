import telegramComponents from "#src/components/telegram/components";

export default class TelegramBotComponent {
    constructor () {
        telegramComponents.add( this );
    }

    // propertirs
    get id () {
        throw `Bot id is reqiored`;
    }

    get name () {
        throw `Bot name is reqiored`;
    }

    get shortDescription () {
        return this.name;
    }

    get description () {
        return this.shortDescription;
    }

    get panel () {
        return import( "./panel" );
    }

    get isPrivate () {
        return false;
    }
}
