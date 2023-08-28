import app from "@/app";
import * as am5 from "@amcharts/amcharts5";

export { am5 };
export { default as themeAnimated } from "@amcharts/amcharts5/themes/Animated";
export { default as themeResponsive } from "@amcharts/amcharts5/themes/Responsive";
export { default as themeMicro } from "@amcharts/amcharts5/themes/Micro";
export { default as lightTheme } from "@amcharts/amcharts5/themes/Dataviz";
export { default as darkTheme } from "@amcharts/amcharts5/themes/Dark";

if ( app.config.amcharts5LicenseKey ) {
    am5.addLicense( app.config.amcharts5LicenseKey );
}
