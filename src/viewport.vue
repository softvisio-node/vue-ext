<template>
    <ext-panel fullscreen="true" layout='{"deferRender":false,"type":"card"}' scrollable="true"/>
</template>

<script>
import "./assets/scrollbars.css";
import Viewport from "@softvisio/vue/viewport";
import ResetPasswordDialog from "./components/reset-password.dialog";

export default {
    "extends": Viewport,

    created () {
        this.resetPasswordDialog = ResetPasswordDialog;
        this.privateView = null;
        this.publicView = null;
    },

    "methods": {
        async init () {
            Ext.Viewport.mask();

            await this.$app.initSession();

            // Ext.Viewport.unmask();

            this.$router.init( this );

            this.$router.reload();
        },

        // router
        async onRoute ( route ) {
            if ( route.get() === "reset-password" ) {
                await this.routeResetPasword();
            }
            else if ( route.get() === "confirm-email" ) {
                await this.routeConfirmEmail();
            }
            else {
                await this._onRoute( route );
            }

            Ext.Viewport.unmask();
        },

        async _onRoute ( route ) {
            if ( this.$app.user.isAuthenticated ) {
                return this.routePrivate( route );
            }
            else {
                return this.routePublic( route );
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
                this.$toast( this.l10n( "Email confirmation token is invalid" ) );
            }
            else {
                Ext.Viewport.mask();

                const res = await this.$api.call( "session/confirm-email-by-token", token );

                Ext.Viewport.unmask();

                if ( res.ok ) {
                    this.$toast( this.l10n( "Email confirmed successfully" ) );
                }
                else {
                    this.$toast( res );
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
