import masks from "#src/masks";

Ext.define( null, {
    "override": "Ext.viewport.Default",

    mask () {
        masks.globalLoadMask.show();
    },

    unmask () {
        masks.globalLoadMask.hide();
    },
} );
