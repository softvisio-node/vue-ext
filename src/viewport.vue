<template>
    <ext-panel fullscreen="true" layout='{"deferRender":false,"type":"card"}' scrollable="true"/>
</template>

<script>
import "./assets/scrollbars.css";
import Viewport from "@softvisio/vue/viewport";
import ResetPasswordDialog from "#src/components/reset-password.dialog";
import AuthorizationDialog from "#src/components/authorization.dialog";

export default {
    "extends": Viewport,

    created () {
        this.privateView = null;
        this.publicView = null;
    },

    "methods": {
        async init () {
            Ext.Viewport.mask();

            await this.$app.initSession();

            this.$router.init( this );

            this.$router.reload();
        },

        // router
        async onRoute ( route ) {
            Ext.Viewport.mask();

            if ( route.get() === "telegram-webapp" ) {
                await this.telegramWebApp();
            }
            else if ( route.get() === "reset-password" ) {
                await this.routeResetPasword();
            }
            else if ( route.get() === "confirm-email" ) {
                await this.routeConfirmEmail();
            }
            else if ( route.get() === "change-email" ) {
                await this.routeChangeEmail();
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
            const cmp = await this.$mount( ResetPasswordDialog );

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
                const res = await this.$api.call( "session/confirm-email-by-token", token );

                if ( res.ok ) {
                    this.$toast( this.l10n( "Email confirmed successfully" ) );
                }
                else {
                    this.$toast( res );
                }
            }

            this.$router.redirectTo( "/", { "replace": true } );
        },

        async routeChangeEmail () {

            // parse toke
            var token = window.location.hash.match( /^#[/]change-email[/]?(.*)/ );

            if ( token ) token = token[1];

            if ( token ) {
                const cmp = await this.$mount( AuthorizationDialog, {
                    "props": {
                        "emailHint": false,
                        "authorize": async options => {
                            const res = await this.$api.call( "account/set-email-by-token", token, options );

                            if ( res.ok ) {
                                this.$router.redirectTo( "/", { "replace": true } );

                                this.$toast( this.l10n( "Email address changed" ) );
                            }

                            return res;
                        },
                    },
                } );

                Ext.Viewport.unmask();

                await cmp.show();
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

        async telegramWebApp () {
            await ( await import( "@softvisio/vue/telegram-webapp" ) ).default();

            try {
                if ( !window.Telegram?.WebApp?.initData ) throw Error();

                var data = JSON.parse( new URL( window.location.hash.substring( 1 ), "file:" ).searchParams.get( "data" ) );

                if ( !data ) throw Error();
            }
            catch ( e ) {
                return this.$router.redirectTo( "/", { "replace": true } );
            }

            if ( !this.$app.user.isAuthenticated ) {

                // sign in
                const res = await this.$app.signIn( {
                    "telegram_bot_id": data.botId,
                    "telegram_init_data": window.Telegram?.WebApp?.initData,
                } );

                if ( !res.ok ) window.Telegram.WebApp.close();
            }

            const components = ( await import( "#src/components/telegram/components" ) ).default;

            const botComponent = components.get( data.botType );

            if ( !botComponent ) window.Telegram.WebApp.close();

            await botComponent.runWebApp( this, data );
        },
    },
};
</script>
