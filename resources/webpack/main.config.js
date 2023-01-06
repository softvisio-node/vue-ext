import { Main as Super } from "@softvisio/vue/resources/webpack/main.config.js";

export class Main extends Super {
    constructor ( options ) {
        super( options );

        this.addSchema( new URL( "../schemas/env.main.schema.yaml", import.meta.url ) );
    }

    // protected
    _generate ( options ) {
        const config = super._generate( options );

        config.resolve.alias = {
            ...config.resolve.alias,
            "#vue": "@softvisio/vue-ext",

            "#ext$": "@softvisio/ext/ext-" + options.buildOptions.extVersion,
            "#ext": "@softvisio/ext/resources/ext-" + options.buildOptions.extVersion,
            "#ewc$": "@softvisio/ext/ewc-" + options.buildOptions.ewcVersion,
            "#ewc": "@softvisio/ext/resources/ewc-" + options.buildOptions.ewcVersion,
            "#ext-charts$": "@softvisio/ext/ext-charts-" + options.buildOptions.extVersion,
        };

        // config.module.rules[1].exclude.push( /[\\/]resources[\\/]ext-[\d.]+[\\/]/, /[\\/]resources[\\/]ewc-[\d.]+[\\/]/ );

        // config.optimization.splitChunks.cacheGroups["ext-charts"] = {
        //     "name": "ext-charts",
        //     test ( module ) {
        //         if ( !module.resource ) return;

        //         const resource = module.resource.replaceAll( "\\", "/" );

        //         if ( resource.includes( "@softvisio/ext/lib/ext-charts-" ) ) return true;

        //         if ( resource.includes( "@softvisio/ext/resources/ext-" + options.buildOptions.extVersion + "/charts.js" ) ) return true;
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

        config.optimization.splitChunks.cacheGroups["pdf"] = {
            "name": "pdf",
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

        return config;
    }
}
