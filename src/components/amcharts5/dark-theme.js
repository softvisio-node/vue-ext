import DarkThemeOrig from "@amcharts/amcharts5/themes/Dark";
import { Color } from "@amcharts/amcharts5/.internal/core//util/Color";

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

export default DarkTheme;
