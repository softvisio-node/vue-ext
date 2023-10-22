import TelegramComponentModel from "./models/component";

const REGISTRY = {};

export default class TelegramBotComponent {
    static #store;

    constructor () {
        if ( REGISTRY[this.type] ) {
            throw Error( `Telegram bot type ${this.type} already registered` );
        }

        REGISTRY[this.type] = this;
    }

    // static
    static get ( type ) {
        return REGISTRY[type];
    }

    static get store () {
        if ( !this.#store ) {
            this.#store = Ext.create( "Ext.data.Store", {
                "model": TelegramComponentModel,
                "remoteSort": false,
                "remoteFilter": false,
                "data": Object.values( REGISTRY ).map( component => {
                    return {
                        "id": component.type,
                        "type": component.type,
                        "name": component.name,
                        "description": component.description,
                    };
                } ),
            } );
        }

        return this.#store;
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
