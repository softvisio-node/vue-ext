import store from "@softvisio/vue/lib/store";

Ext.manifest.material = Ext.manifest.material || {};
Ext.manifest.material.toolbar = Ext.manifest.material.toolbar || {};
Ext.manifest.material.toolbar.dynamic = true;

store.actions.applyDarkMode = ( ctx, darkMode ) => {
    Ext.theme.Material.setColors( { darkMode } );
};

store.actions.applyTheme = ( ctx, theme ) => {
    Ext.theme.Material.setColors( theme );

    // Fashion.css.setVariables({
    //         "base-color-name": "blue",
    //         "accent-color-name": "orange"
    //     });
};

export default store;
