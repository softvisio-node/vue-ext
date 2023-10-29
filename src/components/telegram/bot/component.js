import TelegramComponentModel from "./models/component";

const REGISTRY = {};

export default class TelegramBotComponent {
    static #store;

    constructor () {
        if ( REGISTRY[this.id] ) {
            throw Error( `Telegram bot id ${this.id} already registered` );
        }

        REGISTRY[this.id] = this;
    }

    // static
    static get ( id ) {
        return REGISTRY[id];
    }

    static get store () {
        if ( !this.#store ) {
            this.#store = Ext.create( "Ext.data.Store", {
                "remoteSort": false,
                "remoteFilter": false,
                "data": Object.values( REGISTRY ).map( component => {
                    return new TelegramComponentModel( {
                        "id": component.id,
                        "name": component.name,
                        "description": component.description,
                    } );
                } ),
            } );
        }

        return this.#store;
    }

    // propertirs
    get id () {
        throw `Bot id is reqiored`;
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
