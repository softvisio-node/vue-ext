import locale from "@softvisio/vue/locale";

export default locale;

await locale.add( "vue-ext", language => import( /* webpackChunkName: "locales/[request]" */ "#resources/locales/" + language + ".po" ) );
