import "#ext";
import "#ewc";
import VueViewport from "@softvisio/vue/app/viewport";

// must be impoerted after ExtJS
import( "@fortawesome/fontawesome-free/css/all.min.css" );
import( "#src/Ext.override.viewport.Default" );

export default class VueExtViewport extends VueViewport {

    // public
    async init () {

        // set theme listeners
        this.app.theme.on( "darkModeChange", this.#applyTheme.bind( this ) );
        this.app.theme.on( "themeChange", this.#applyTheme.bind( this ) );

        // apply theme
        this.#applyTheme();

        await super.init();

        return new Promise( resolve => {
            Ext.application( {
                "name": "-",
                "quickTips": true,
                "app": this.app,
                "launch": resolve,
            } );
        } );
    }

    mount ( selector ) {

        // mount to the Ext.Viewport
        super.mount( Ext.Viewport.el.dom );
    }

    // protected
    _createVauApp () {
        const vue = super._createVauApp();

        vue.config.globalProperties.$router = this.app.router;

        // components requires .toString() method,
        // because ext is trying to convert component to string when component is passed as scope to .on() call
        vue.config.globalProperties.toString = function () {
            return null;
        };

        return vue;
    }

    // private
    #applyTheme () {
        Ext.theme.Material.setColors( { ...this.app.theme.theme, "darkMode": this.app.theme.darkMode } );
    }
}
