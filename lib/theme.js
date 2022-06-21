import Events from "#core/events";

Ext.manifest.material = Ext.manifest.material || {};
Ext.manifest.material.toolbar = Ext.manifest.material.toolbar || {};
Ext.manifest.material.toolbar.dynamic = true;

class Theme extends Events {
    #theme;

    constructor () {
        super( { "maxListeners": Infinity } );
    }

    // properties
    get theme () {
        return this.#theme;
    }

    set theme ( theme ) {
        this.#theme = theme;

        this.emit( "theme", this.#theme );
    }
}

export default new Theme();
