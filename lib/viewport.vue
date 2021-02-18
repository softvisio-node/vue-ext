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

    created () {
        this.appInitFailureDialog = AppInitFailureDialog;
        this.resetPasswordDialog = ResetPasswordDialog;
        this.defaultMask = defaultMask;
        this.privateView = null;
        this.publicView = null;
    },

    "methods": {
        async createViewport () {
            return new Promise( resolve => {
                Ext.application( {
                    "name": "app",
                    "quickTips": true,
                    "launch": () => {

                        // XXX
                        // This is related to issue, when first displayed floated dialog is despalyed without animation.
                        // And cant' be closed, because animation is on unfinished state.
                        // As workaround we can call cmp.activeAnimation.stop() before hide() call;
                        const dialog = Ext.Viewport.add( {
                            "xtype": "dialog",
                            "modal": false,
                            "width": 1000,
                            "height": 11000,
                        } );

                        dialog.show( null );
                        if ( dialog.activeAnimation ) dialog.activeAnimation.stop();
                        dialog.hide( { "type": "slide", "duration": 1, "easing": "ease-out" } );
                        dialog.destroy();

                        this.ready();

                        resolve();
                    },
                } );
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
                this.$utils.toast( res );

                await this.onAppInitFailure();
            }

            this.$router.init( this );

            this.$router.reload();

            this.$watch( "sessionIsAuthenticated", this.onAuthChange.bind( this ) );
        },

        async onAppInitFailure () {
            return new Promise( resolve => {
                this.$mount( this.appInitFailureDialog, {
                    "props": {
                        "onVnodeUnmounted": resolve,
                    },
                } );
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
            this.$mount( this.resetPasswordDialog );
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

                this.view = await this.$mount( this.publicView, { "el": Ext.Viewport } );
            }

            route.forward( this.view );
        },

        async routePrivate ( route ) {
            if ( !this.privateView ) return;

            if ( this.currentView !== "private" ) {
                this.currentView = "private";

                if ( this.view ) this.view.$unmount();

                this.view = await this.$mount( this.privateView, { "el": Ext.Viewport } );
            }

            route.forward( this.view );
        },
    },
};
</script>
