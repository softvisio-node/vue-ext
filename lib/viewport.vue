<template>
    <div/>
</template>

<script>
import "./assets/scrollbars.css";
import Viewport from "@softvisio/vue/lib/viewport.vue";
import defaultMask from "./load-mask";
import RecoverPasswordDialog from "./components/recover-password-dialog";
import AppInitFailureDialog from "./components/app-init-failure-dialog";

export default {
    "extends": Viewport,

    "data": () => {
        return {
            "appInitFailureDialog": AppInitFailureDialog,
            "recoverPasswordDialog": RecoverPasswordDialog,
            "defaultMask": defaultMask,
            "privateView": null,
            "publicView": null,
        };
    },

    "methods": {
        async createViewport () {
            Ext.application( {
                "name": "app",
                "launch": this.ready.bind( this ),
            } );
        },

        async ready () {
            var viewport = Ext.Viewport;

            while ( 1 ) {
                viewport.mask( this.defaultMask );

                var res = await this.$store.dispatch( "session/signin" );

                viewport.unmask();

                if ( res.isSuccess() ) break;

                await this.onAppInitFailure();
            }

            this.$router.init( this );

            this.$router.reload();

            this.$watch( "sessionIsAuthenticated", this.onAuthChange.bind( this ) );
        },

        async onAppInitFailure () {
            const dialog = await Ext.Viewport.addVue( this.appInitFailureDialog );

            return new Promise( ( resolve ) => {
                dialog.$once( "hook:beforeDestroy", resolve );
            } );
        },

        onAuthChange () {
            this.$router.reload();
        },

        // ROUTER
        async onRoute ( route ) {
            if ( route.get() === "recover-password" ) {
                this.routeRecoverPasword();
            }
            else if ( route === "confirm-email" ) {
                this.routeConfirmEmail();
            }
            else {
                if ( this.sessionIsAuthenticated ) {
                    this.routePrivate( route );
                }
                else {
                    this.routePublic( route );
                }
            }
        },

        async routeRecoverPasword () {
            Ext.Viewport.addVue( this.recoverPasswordDialog );
        },

        // TODO
        async routeConfirmEmail () {},

        async routePublic ( route ) {
            if ( !this.publicView ) return;

            if ( this.currentView !== "public" ) {
                this.currentView = "public";

                if ( this.view ) this.view.$destroy();

                this.view = await Ext.Viewport.addVue( this.publicView );
            }

            route.forward( this.view );
        },

        async routePrivate ( route ) {
            if ( !this.privateView ) return;

            if ( this.currentView !== "private" ) {
                this.currentView = "private";

                if ( this.view ) this.view.$destroy();

                this.view = await Ext.Viewport.addVue( this.privateView );
            }

            route.forward( this.view );
        },
    },
};
</script>
