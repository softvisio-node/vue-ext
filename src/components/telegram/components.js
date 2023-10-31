import TelegramComponentModel from "./bot/models/component";

class TelegramComponent {
    #components = {};

    // properties
    get hasPublicComponents () {
        for ( const component of Object.values( this.#components ) ) {
            if ( !component.isPrivate ) return true;
        }

        return false;
    }

    get store () {
        return Ext.create( "Ext.data.Store", {
            "remoteSort": false,
            "remoteFilter": false,
            "data": Object.values( this.#components )
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

    // public
    get ( id ) {
        return this.#components[id];
    }

    add ( component ) {
        if ( this.#components[component.id] ) {
            throw Error( `Telegram bot id ${component.id} already registered` );
        }

        this.#components[component.id] = component;
    }
}

export default new TelegramComponent();
