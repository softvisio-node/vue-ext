import app from "#app";

export default Ext.define( null, {
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
        "memory_used",
        "memory_rss",
        "fs_total",
        "fs_used",

        // calculates
        { "name": "instance_type", "calculate": data => `${data.package}/${data.service}` },

        { "name": "memory_used_text", "calculate": data => `${app.locale.formatNumber( data.memory_used / 1024 ** 3, "style:unit,unit:gigabyte" )} ( ${app.locale.formatPercent( data.memory_used / data.memory_total )} )` },

        { "name": "memory_rss_text", "calculate": data => `${app.locale.formatNumber( data.memory_rss / 1024 ** 3, "style:unit,unit:gigabyte" )} ( ${app.locale.formatPercent( data.memory_rss / data.memory_total )} )` },

        { "name": "fs_used_text", "calculate": data => `${app.locale.formatNumber( data.fs_used / 1024 ** 3, "style:unit,unit:gigabyte" )} ( ${app.locale.formatPercent( data.fs_used / data.fs_total )} )` },
    ],
} );
