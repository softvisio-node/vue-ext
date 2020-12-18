import Store from ".";
import ElectronUpdateModel from "../models/electron-update";

export default class extends Store {
    get model () {
        return ElectronUpdateModel;
    }

    get store () {
        if ( !Ext.getStore( "electron-updates" ) ) {
            Ext.regStore( "electron-updates", {
                "model": this.model,
                "autoLoad": false,
                "pageSize": 50,
            } );
        }

        return Ext.getStore( "electron-updates" );
    }

    reload () {
        this.store.loadPage( 1 );
    }
}
