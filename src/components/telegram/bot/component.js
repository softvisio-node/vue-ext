const REGISTRY = {};

export default class TelegramBotComponent {
    constructor () {
        if ( REGISTRY[this.type] ) {
            throw Error( `Telegram bot type ${this.type} already registered` );
        }

        REGISTRY[this.type] = this;
    }

    static get ( type ) {
        return REGISTRY[type];
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
