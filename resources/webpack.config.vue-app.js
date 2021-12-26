import config from "@softvisio/vue/resources/webpack.config.vue-app.js";

config.resolve.alias = {
    ...config.resolve.alias,
    "#vue": "@softvisio/vue-ext",

    "#ext$": "@softvisio/ext/ext-" + process.env.EXT_VERSION,
    "#ext": "@softvisio/ext/resources/ext-" + process.env.EXT_VERSION,
    "#ewc$": "@softvisio/ext/ewc-" + process.env.EWC_VERSION,
    "#ewc": "@softvisio/ext/resources/ewc-" + process.env.EWC_VERSION,
};

// config.module.rules[1].exclude.push( /[\\/]resources[\\/]ext-[\d.]+[\\/]/, /[\\/]resources[\\/]ewc-[\d.]+[\\/]/ );

config.optimization.splitChunks.cacheGroups["ext"] = {
    "name": "ext",
    "test": /@softvisio[\\/]ext[\\/]/,
    "priority": -9,
    "chunks": "initial",
};

config.optimization.splitChunks.cacheGroups["froala-editor"] = {
    "name": "froala-editor",
    "test": /froala-editor[\\/]/,
    "priority": -9,
    "chunks": "all",
};

config.optimization.splitChunks.cacheGroups["amcharts4"] = {
    "name": "amcharts4",
    "test": /@amcharts[\\/]amcharts4[\\/]/,
    "priority": -9,
    "chunks": "all",
};

config.optimization.splitChunks.cacheGroups["pdfjs"] = {
    "name": "pdfjs",
    "test": /pdfjs-dist[\\/]/,
    "priority": -9,
    "chunks": "all",
};

export default config;
