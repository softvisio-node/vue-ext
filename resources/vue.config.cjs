const config = require( "@softvisio/vue/resources/vue.config.cjs" );

const _configureWebpack = config.configureWebpack;

config.configureWebpack = config => {

    // call base method
    _configureWebpack( config );

    // aliases
    config.resolve.alias["#vue"] = "@softvisio/vue-ext";

    config.resolve.alias["#ext$"] = "@softvisio/ext/ext-" + process.env.EXT_VERSION;
    config.resolve.alias["#ext"] = "@softvisio/ext/resources/ext-" + process.env.EXT_VERSION;
    config.resolve.alias["#ewc$"] = "@softvisio/ext/ewc-" + process.env.EWC_VERSION;
    config.resolve.alias["#ewc"] = "@softvisio/ext/resources/ewc-" + process.env.EWC_VERSION;

    // node polyfills
    config.resolve.fallback ||= {};

    // required by froala, can be replaced with crypto-browserify
    config.resolve.fallback.crypto = false;
};

const _chainWebpack = config.chainWebpack;

config.chainWebpack = config => {

    // call base method
    _chainWebpack( config );

    // vue3
    config.module
        .rule( "vue" )
        .use( "vue-loader" )
        .loader( "vue-loader" )
        .tap( options => {
            options.compilerOptions = {
                ...( options.compilerOptions || {} ),
                "isCustomElement": tag => tag.startsWith( "ext-" ),
            };

            return options;
        } );
};

module.exports = config;
