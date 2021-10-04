export default Ext.define( "", {
    "extend": "Ext.data.Model",

    "fields": [
        "id",

        //
        { "name": "idText", "calculate": data => `<b style="font-size:1.1em">${data.id}</b>` },

        { "name": "lastUpdated", "type": "date" },

        { "name": "activeRequests_limit", "type": "integer", "allowNull": true },
        { "name": "activeRequests_limit_text", "calculate": data => data.activeRequests_limit || "&mdash;" },

        { "name": "activeRequestsUserLimit", "type": "integer", "allowNull": true },
        { "name": "activeRequestsUserLimitText", "calculate": data => data.activeRequestsUserLimit || "&mdash;" },

        { "name": "totalActiveRequests", "type": "integer" },
        { "name": "activeRequestsText", "calculate": data => `${data.totalActiveRequests} / ${data.activeRequestsLimitText}` },
        { "name": "activeRequestsValue", "calculate": data => ( data.activeRequestsLimit ? data.totalActiveRequests / data.activeRequestsLimit : 0.5 ) },

        // charts
        { "name": "load", "type": "array" },
        { "name": "requests", "type": "array" },
    ],
} );
