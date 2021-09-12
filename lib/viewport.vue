<template>
    <ext-panel fullscreen="true" layout="card" scrollable="true"/>
</template>

<script>
import "./assets/scrollbars.css";
import Viewport from "@softvisio/vue/viewport";
import defaultMask from "./load-mask";
import ResetPasswordDialog from "./components/reset-password-dialog";
import AppInitFailureDialog from "./components/app-init-failure-dialog";

export default {
    "extends": Viewport,

    created () {
        this.appInitFailureDialog = AppInitFailureDialog;
        this.resetPasswordDialog = ResetPasswordDialog;
        this.defaultMask = defaultMask;
        this.privateView = null;
        this.publicView = null;
    },

    async mounted () {
        var viewport = Ext.Viewport;

        // init session
        while ( true ) {
            viewport.mask( this.defaultMask );

            var res = await this.$store.session.signin();

            viewport.unmask();

            // connection ok
            if ( res.ok || res.status === 401 || res.status === 403 ) break;

            // connection error
            this.$utils.toast( res );

            await this.onAppInitFailure();
        }

        this.$router.init( this );

        this.$router.reload();

        this.$watch( "isAuthenticated", this.onAuthChange.bind( this ) );
    },

    "methods": {
        async onAppInitFailure () {
            return new Promise( resolve => {
                this.$mount( this.appInitFailureDialog, {
                    "props": {
                        "onReconnect": resolve,
                    },
                    "cache": false,
                } ).then( cmp => cmp.ext.show() );
            } );
        },

        onAuthChange () {

            // window.location.reload();
            this.$router.reload();
        },

        // router
        async onRoute ( route ) {
            if ( route.get() === "reset-password" ) {
                this.routeResetPasword();
            }
            else if ( route.get() === "confirm-email" ) {
                this.routeConfirmEmail();
            }
            else {
                if ( this.isAuthenticated ) {
                    this.routePrivate( route );
                }
                else {
                    this.routePublic( route );
                }
            }
        },

        async routeResetPasword () {
            const cmp = await this.$mount( this.resetPasswordDialog );

            cmp.ext.show();
        },

        async routeConfirmEmail () {

            // parse toke
            var token = window.location.hash.match( /^#[/]confirm-email[/]?(.*)/ );

            if ( token ) token = token[1];

            if ( !token ) {
                this.$utils.toast( "Email confirmation token is invalid." );
            }
            else {
                Ext.Viewport.mask();

                const res = await this.$store.session.confirmEmailByToken( token );

                Ext.Viewport.unmask();

                if ( res.ok ) {
                    this.$utils.toast( "Email confirmed successfully." );
                }
                else {
                    this.$utils.toast( res );
                }
            }

            this.$router.redirectTo( "/", { "replace": true } );
        },

        async routePublic ( route ) {
            if ( !this.publicView ) return;

            if ( this.currentView !== "public" ) {
                this.currentView = "public";

                if ( this.view ) this.view.$unmount();

                this.view = await this.$mount( this.publicView );
            }

            route.forward( this.view );
        },

        async routePrivate ( route ) {
            if ( !this.privateView ) return;

            if ( this.currentView !== "private" ) {
                this.currentView = "private";

                if ( this.view ) this.view.$unmount();

                this.view = await this.$mount( this.privateView );
            }

            route.forward( this.view );
        },
    },
};
</script>
