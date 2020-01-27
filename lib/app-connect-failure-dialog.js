export default Ext.define( "", {
    "extend": "Ext.Dialog",

    "title": "Server Connection Error",
    "draggable": false,

    "layout": "vbox",
    "width": "300",
    "minHeight": "350",
    "shadow": "true",

    "defaultListenerScope": true,

    "items": [
        {
            "xtype": "panel",
            "layout": "center",
            "html": `Unable to connect to the API server.`,
        },
        {
            "xtype": "toolbar",
            "docked": "bottom",

            "layout": {
                "type": "hbox",
                "align": "center",
                "pack": "center",
            },

            "items": [
                {
                    "xtype": "button",
                    "iconCls": "fas fa-redo",
                    "text": "Try Again",
                    "ui": "action",
                    "handler": "close",
                },
            ],
        },
    ],

    close () {
        this.onClose();

        this.destroy();
    },
} );
