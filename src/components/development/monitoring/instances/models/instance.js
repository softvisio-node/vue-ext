export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "fields": [
        "id",

        // fields
        "package",
        "service",
        "instance",
        { "name": "created", "type": "date" },
        { "name": "last_updated", "type": "date" },
        "memory_total",
        "memory_free",
        "memory_rss",
        "fs_total",
        "fs_free",
    ],
} );
