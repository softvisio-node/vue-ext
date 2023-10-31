import TelegramComponentModel from "./models/component";

const REGISTRY = {};

export default class TelegramBotComponent {
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

    static hasPublic () {
        for ( const component of Object.vajues( REGISTRY ) ) {
            if ( !component.isPrivate ) return true;
        }

        return false;
    }

    static get store () {
        return Ext.create( "Ext.data.Store", {
            "remoteSort": false,
            "remoteFilter": false,
            "data": Object.values( REGISTRY )
                .filter( component => !component.isPrivate )
                .map( component => {
                    return new TelegramComponentModel( {
                        "id": component.id,
                        "name": component.name,
                        "short_description": component.shortDescription,
                        "description": component.description,
                    } );
                } ),
        } );
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
