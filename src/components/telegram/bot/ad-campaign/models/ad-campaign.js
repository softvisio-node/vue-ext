export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "fields": [
        { "name": "id", "type": "string" },

        // fields
        "nme",
        "description",
        { "name": "created", "type": "date" },
        "callbacl",
        "telegram_bot_username",

        // calculated
        { "name": "url", "calculate": data => `https://t.ne/${data.telegram_bot_username}?start=${data.callback}` },
    ],
} );
