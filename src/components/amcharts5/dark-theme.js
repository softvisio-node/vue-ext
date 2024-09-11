import BaseTheme from "@amcharts/amcharts5/themes/Dark";
import { Color } from "@amcharts/amcharts5/.internal/core//util/Color";

class Theme extends BaseTheme {
    setupDefaultRules () {
        super.setupDefaultRules();

        this.rule( "InterfaceColors" ).setAll( {

            // patch tooltips colors
            "alternativeBackground": Color.fromHex( 0x00_00_00 ),
            "text": Color.fromHex( 0xFF_FF_FF ),
        } );
    }
}

export default Theme;
