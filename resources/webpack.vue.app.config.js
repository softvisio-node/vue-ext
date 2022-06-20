import config from "@softvisio/vue/resources/webpack.vue.app.config.js";

config.schemas.push( new URL( "./schemas/env.vue.app.schema.yaml", import.meta.url ) );

config.resolve.alias = {
    ...config.resolve.alias,
    "#vue": "@softvisio/vue-ext",

    "#ext$": "@softvisio/ext/ext-" + process.env.EXT_VERSION,
    "#ext": "@softvisio/ext/resources/ext-" + process.env.EXT_VERSION,
    "#ewc$": "@softvisio/ext/ewc-" + process.env.EWC_VERSION,
    "#ewc": "@softvisio/ext/resources/ewc-" + process.env.EWC_VERSION,
    "#ext-charts$": "@softvisio/ext/ext-charts-" + process.env.EXT_VERSION,
};

// config.module.rules[1].exclude.push( /[\\/]resources[\\/]ext-[\d.]+[\\/]/, /[\\/]resources[\\/]ewc-[\d.]+[\\/]/ );

// config.optimization.splitChunks.cacheGroups["ext-charts"] = {
//     "name": "ext-charts",
//     test ( module ) {
//         if ( !module.resource ) return;

//         const resource = module.resource.replaceAll( "\\", "/" );

//         if ( resource.includes( "@softvisio/ext/lib/ext-charts-" ) ) return true;

//         if ( resource.includes( "@softvisio/ext/resources/ext-" + process.env.EXT_VERSION + "/charts.js" ) ) return true;
//     },
//     "priority": -9,
//     "chunks": "all",
// };

// config.optimization.splitChunks.cacheGroups["ext"] = {
//     "name": "ext",
//     "test": /@softvisio[\\/]ext[\\/]/,
//     "priority": -9,
//     "chunks": "initial",
// };

config.optimization.splitChunks.cacheGroups["froala-editor"] = {
    "name": "froala-editor",
    "test": /froala-editor[\\/]/,
    "priority": -9,
    "chunks": "all",
};

config.optimization.splitChunks.cacheGroups["amcharts5"] = {
    "name": "amcharts5",
    "test": /@amcharts[\\/]amcharts5[\\/]/,
    "priority": -9,
    "chunks": "all",
};

config.optimization.splitChunks.cacheGroups["pdfjs"] = {
    "name": "pdfjs",
    "test": /pdfjs-dist[\\/]/,
    "priority": -9,
    "chunks": "all",
};

config.optimization.splitChunks.cacheGroups["fontawesome"] = {
    "name": "fa",
    "test": /@fortawesome[\\/]/,
    "priority": -9,
    "chunks": "all",
};

export default config;
