import app from "#app";
import * as am5 from "@amcharts/amcharts5";

export { am5 };
export { default as ThemeAnimated } from "@amcharts/amcharts5/themes/Animated";
export { default as ThemeResponsive } from "@amcharts/amcharts5/themes/Responsive";
export { default as ThemeMicro } from "@amcharts/amcharts5/themes/Micro";
export { default as LightTheme } from "@amcharts/amcharts5/themes/Dataviz";
import DarkThemeOrig from "@amcharts/amcharts5/themes/Dark";
import { Color } from "@amcharts/amcharts5/.internal/core//util/Color";
export { default as locale } from "./locale.js";

if ( app.config.amcharts5LicenseKey ) {
    am5.addLicense( app.config.amcharts5LicenseKey );
}

class DarkTheme extends DarkThemeOrig {
    setupDefaultRules () {
        super.setupDefaultRules();

        this.rule( "InterfaceColors" ).setAll( {

            // patch tooltips colors
            "alternativeBackground": Color.fromHex( 0x000000 ),
            "text": Color.fromHex( 0xffffff ),
        } );
    }
}

export { DarkTheme };
