import BaseTheme from "@amcharts/amcharts5/themes/Dark";
import { Color } from "@amcharts/amcharts5/.internal/core//util/Color";

class Theme extends BaseTheme {
    setupDefaultRules () {
        super.setupDefaultRules();

        this.rule( "InterfaceColors" ).setAll( {

            // patch tooltips colors
            "alternativeBackground": Color.fromHex( 0x000000 ),
            "text": Color.fromHex( 0xffffff ),
        } );
    }
}

export default Theme;
