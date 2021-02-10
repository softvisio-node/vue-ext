const config = require( "@softvisio/vue/resources/vue.config" );

const _configureWebpack = config.configureWebpack;

config.configureWebpack = config => {

    // call base method
    _configureWebpack( config );

    // aliases
    config.resolve.alias["#ext.js"] = "@softvisio/ext/lib/ext-" + process.env.EXT_VERSION + ".js";
    config.resolve.alias["#ext-resources"] = "@softvisio/ext/resources/ext-" + process.env.EXT_VERSION;

    config.resolve.alias["#ewc.js"] = "@softvisio/ext/lib/ewc-" + process.env.EWC_VERSION + ".js";
    config.resolve.alias["#ewc-resources"] = "@softvisio/ext/resources/ewc-" + process.env.EWC_VERSION;

    config.resolve.alias["#softvisio"] = "@softvisio/vue-ext/lib";
};

const _chainWebpack = config.chainWebpack;

config.chainWebpack = config => {

    // call base method
    _chainWebpack( config );

    // vue3
    config.module
        .rule( "vue" )
        .use( "vue-loader" )

        // .loader( "vue-loader" )
        .loader( require.resolve( "vue-loader-v16" ) ) // XXX remove
        .tap( options => {
            options.compilerOptions = {
                ...( options.compilerOptions || {} ),
                "isCustomElement": tag => tag.startsWith( "ext-" ),
            };

            return options;
        } );
};

module.exports = config;
