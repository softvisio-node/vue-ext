<template>
    <div/>
</template>

<script>
import "./assets/scrollbars.css";
import Viewport from "@softvisio/vue/viewport.vue";
import defaultMask from "./load-mask";
import ResetPasswordDialog from "./components/reset-password-dialog";
import AppInitFailureDialog from "./components/app-init-failure-dialog";

export default {
    "extends": Viewport,

    "data": () => {
        return {
            "appInitFailureDialog": AppInitFailureDialog,
            "resetPasswordDialog": ResetPasswordDialog,
            "defaultMask": defaultMask,
            "privateView": null,
            "publicView": null,
        };
    },

    "methods": {
        async createViewport () {
            Ext.application( {
                "name": "app",
                "quickTips": true,
                "launch": this.ready.bind( this ),
            } );
        },

        async ready () {
            var viewport = Ext.Viewport;

            // init session
            while ( 1 ) {
                viewport.mask( this.defaultMask );

                var res = await this.$store.session.signin();

                viewport.unmask();

                // connection ok
                if ( res.ok || res.status === 401 || res.status === 403 ) break;

                // connection error
                this.$util.toast( res );

                await this.onAppInitFailure();
            }

            this.$router.init( this );

            this.$router.reload();

            this.$watch( "sessionIsAuthenticated", this.onAuthChange.bind( this ) );
        },

        async onAppInitFailure () {
            const dialog = await Ext.Viewport.addVue( this.appInitFailureDialog );

            return new Promise( resolve => {
                dialog.$once( "hook:beforeDestroy", resolve );
            } );
        },

        onAuthChange () {
            this.$router.reload();
        },

        // ROUTER
        async onRoute ( route ) {
            if ( route.get() === "reset-password" ) {
                this.routeResetPasword();
            }
            else if ( route.get() === "confirm-email" ) {
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

        async routeResetPasword () {
            Ext.Viewport.addVue( this.resetPasswordDialog );
        },

        async routeConfirmEmail () {

            // parse toke
            var token = window.location.hash.match( /^#[/]confirm-email[/]?(.*)/ );

            if ( token ) token = token[1];

            if ( !token ) {
                this.$util.toast( "Email confirmation token is invalid." );
            }
            else {
                Ext.Viewport.mask();

                const res = await this.$store.session.confirmEmailByToken( token );

                Ext.Viewport.unmask();

                if ( res.ok ) {
                    this.$util.toast( "Email confirmed successfully." );
                }
                else {
                    this.$util.toast( res );
                }
            }

            this.$router.redirectTo( "/", { "replace": true } );
        },

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
