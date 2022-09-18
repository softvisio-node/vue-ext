<template>
    <ext-panel fullscreen="true" layout='{"deferRender":false,"type":"card"}' scrollable="true"/>
</template>

<script>
import "./assets/scrollbars.css";
import Viewport from "@softvisio/vue/viewport";
import defaultMask from "./load-mask";
import ResetPasswordDialog from "./components/reset-password.dialog";

export default {
    "extends": Viewport,

    created () {
        this.resetPasswordDialog = ResetPasswordDialog;
        this.defaultMask = defaultMask;
        this.privateView = null;
        this.publicView = null;
    },

    "methods": {
        async init () {
            var viewport = Ext.Viewport;

            viewport.mask( this.defaultMask );

            await this.$app.checkAuthorization();

            viewport.unmask();

            this.$router.init( this );

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
                this._onRoute( route );
            }
        },

        async _onRoute ( route ) {
            if ( this.isAuthenticated ) {
                this.routePrivate( route );
            }
            else {
                this.routePublic( route );
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
                this.$utils.toast( this.i18nd( `vue-ext`, "Email confirmation token is invalid" ) );
            }
            else {
                Ext.Viewport.mask();

                const res = await this.$api.call( "session/confirm-email-by-token", token );

                Ext.Viewport.unmask();

                if ( res.ok ) {
                    this.$utils.toast( this.i18nd( `vue-ext`, "Email confirmed successfully" ) );
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
