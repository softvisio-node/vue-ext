export * from "@softvisio/vue/utils";

export async function alert ( message, { title, width = 350, height = 200, iconCls } = {} ) {
    title ??= window.i18nd( `vue-ext`, `Warning` );
    iconCls ??= "fa-solid fa-triangle-exclamation fa-2xl";

    return new Promise( resolve => {
        const dialog = new Ext.Dialog( {
            title,
            "layout": "hbox",
            width,
            height,
            "defaultFocus": "#ok",
            "keyMap": {
                "ESC": e => {
                    e.preventDefault();

                    this.onEscape( e );
                },
            },
            "items": [
                {
                    "xtype": "component",
                    "padding": "0 30 0 `0",
                    "html": `<i class="${iconCls}"></i>`,
                    "hidden": !iconCls,
                },
                {
                    "xtype": "component",
                    "flex": 1,
                    "html": message,
                },
                {
                    "xtype": "toolbar",
                    "layout": { "pack": "end" },
                    "docked": "bottom",
                    "items": [
                        {
                            "id": "ok",
                            "text": window.i18nd( "vue-ext", "Ok" ),
                            "handler": () => dialog.close(),
                        },
                    ],
                },
            ],
        } );

        dialog.on( "destroy", resolve );

        dialog.show();
    } );
}

export async function confirm ( message, { title, width = 350, height = 200, iconCls } = {} ) {
    title ??= window.i18nd( `vue-ext`, "Confirmation" );
    iconCls ??= "fa-solid fa-circle-question fa-2xl";

    return new Promise( resolve => {
        var res = false;

        const dialog = new Ext.Dialog( {
            title,
            "layout": "hbox",
            width,
            height,
            "defaultFocus": "#ok",
            "items": [
                {
                    "xtype": "component",
                    "padding": "0 30 0 `0",
                    "html": `<i class="${iconCls}"></i>`,
                    "hidden": !iconCls,
                },
                {
                    "xtype": "component",
                    "flex": 1,
                    "html": message,
                },
                {
                    "xtype": "toolbar",
                    "layout": { "pack": "end" },
                    "docked": "bottom",
                    "items": [
                        {
                            "id": "ok",
                            "text": window.i18nd( "vue-ext", "Ok" ),
                            "handler": () => {
                                res = true;

                                dialog.close();
                            },
                        },
                        {
                            "text": window.i18nd( "vue-ext", "Cancel" ),
                            "handler": () => dialog.close(),
                        },
                    ],
                },
            ],
        } );

        dialog.on( "destroy", () => resolve( res ) );

        dialog.show();
    } );
}

export async function prompt ( title, message ) {
    return new Promise( resolve => {
        Ext.Msg.prompt( title, message, function ( buttonId, text ) {
            if ( buttonId === "ok" ) {
                resolve( text.trim() );
            }
            else {
                resolve;
            }
        } );
    } );
}

export function toast ( msg, timeout ) {
    if ( Ext.isObject( msg ) ) msg = msg.statusText ?? msg + "";

    Ext.toast( msg, timeout || 3000 );
}
