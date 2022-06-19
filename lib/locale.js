import locale from "@softvisio/vue/locale";

export default locale;

await locale.add( language => import( /* webpackMode: "eager" */ "#resources/locales/" + language + ".po" ), "vue-ext" );
