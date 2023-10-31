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

    get isPrivate () {
        return false;
    }

    get panel () {
        return import( "./details/panel" );
    }
}
