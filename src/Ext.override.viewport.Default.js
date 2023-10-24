import loadMask from "#src/load-mask";

const mask = new Ext.LoadMask( {
    ...loadMask,
    "floated": true,
    "alwaysOnTop": true,
} );

Ext.define( null, {
    "override": "Ext.viewport.Default",

    mask () {
        mask.show();
    },

    unmask () {
        mask.hide();
    },
} );
