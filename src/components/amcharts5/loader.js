import * as am5 from "@amcharts/amcharts5";
import app from "#app";

export { am5 };
export { default as ThemeAnimated } from "@amcharts/amcharts5/themes/Animated";
export { default as ThemeResponsive } from "@amcharts/amcharts5/themes/Responsive";
export { default as ThemeMicro } from "@amcharts/amcharts5/themes/Micro";
export { default as LightTheme } from "./light-theme.js";
export { default as DarkTheme } from "./dark-theme.js";
export { default as locale } from "./locale.js";

if ( app.config.amcharts5LicenseKey ) {
    am5.addLicense( app.config.amcharts5LicenseKey );
}
