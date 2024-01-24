<template>
    <ext-panel fullscreen="true" layout='{"deferRender":false,"type":"card"}' scrollable="true" @ready="_ready"/>
</template>

<script>
import "./assets/scrollbars.css";
import Viewport from "@softvisio/vue/viewport";
import ResetPasswordDialog from "#src/components/reset-password.dialog";
import AuthorizationDialog from "#src/components/authorization.dialog";
import loadTelegram from "@softvisio/vue/telegram-webapp";

export default {
    "extends": Viewport,

    created () {
        this.privateView = null;
        this.publicView = null;
    },

    "methods": {
        async _ready ( e ) {
            const cmp = e?.detail?.cmp;

            if ( !cmp ) return;

            this.ext = cmp;

            this.$app.mask();

            await this.$app.initSession();

            this.route();
        },

        mask () {
            Ext.Viewport.mask();
        },

        unmask () {
            Ext.Viewport.unmask();
        },

        // router
        async route () {
            this.$app.mask();

            if ( this.$router.path === "/telegram-webapp" ) {
                await this.routeTelegramWebApp();
            }
            else if ( this.$router.path === "/reset-password" ) {
                await this.routeResetPasword();
            }
            else if ( this.$router.path === "/confirm-email" ) {
                await this.routeConfirmEmail();
            }
            else if ( this.$router.path === "/change-email" ) {
                await this.routeChangeEmail();
            }
            else {
                await this._route();
            }

            this.$app.unmask();
        },

        async _route () {
            if ( this.$app.user.isAuthenticated ) {
                return this.routePrivate();
            }
            else {
                return this.routePublic();
            }
        },

        async routeResetPasword () {
            const cmp = await this.$mount( ResetPasswordDialog );

            cmp.ext.show();
        },

        async routeConfirmEmail () {

            // parse toke
            var token = this.$router.searchParams.get( "token" );

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

            this.$router.reload( "/", { "replace": true } );
        },

        async routeChangeEmail () {

            // parse toke
            var token = this.$router.searchParams.get( "token" );

            if ( token ) token = token[ 1 ];

            if ( token ) {
                const cmp = await this.$mount( AuthorizationDialog, {
                    "props": {
                        "emailHint": false,
                        "authorize": async options => {
                            const res = await this.$api.call( "account/set-email-by-token", token, options );

                            if ( res.ok ) {
                                this.$router.reload( "/", { "replace": true } );

                                this.$toast( this.l10n( "Email address changed" ) );
                            }

                            return res;
                        },
                    },
                } );

                this.$app.unmask();

                await cmp.show();
            }

            this.$router.reload( "/", { "replace": true } );
        },

        async routePublic () {
            if ( !this.publicView ) return;

            if ( this.currentView !== "public" ) {
                this.currentView = "public";

                if ( this.view ) this.view.$unmount();

                this.view = await this.$mount( this.publicView );
            }
        },

        async routePrivate () {
            if ( !this.privateView ) return;

            if ( this.currentView !== "private" ) {
                this.currentView = "private";

                if ( this.view ) this.view.$unmount();

                this.view = await this.$mount( this.privateView );
            }
        },

        async routeTelegramWebApp () {

            // load telegram
            await loadTelegram();

            // decode init data
            try {
                var data = JSON.parse( this.$router.searchParams.get( "data" ) );

                // init data is not valid
                if ( !data ) throw Error();
            }
            catch ( e ) {
                return window.Telegram?.WebApp?.close();
            }

            // authenticated
            if ( this.$app.user.isAuthenticated ) {

                // authenticated as other user
                if ( data.userId !== this.$app.user.id ) {

                    // sign out
                    return this.$app.signOut();
                }
            }

            // not authenticated, auth is required
            else if ( data.userId ) {
                if ( !window.Telegram?.WebApp?.initData ) return window.Telegram?.WebApp?.close();

                // sign in
                const res = await this.$app.signIn( {
                    "telegram_bot_id": data.telegramBotId,
                    "telegram_webapp_init_data": window.Telegram?.WebApp?.initData,
                } );

                // sign in failed
                if ( !res.ok ) return window.Telegram?.WebApp?.close();
            }

            // load telegram components
            await import( "@/telegram-components" );

            const components = ( await import( "#src/components/telegram/components" ) ).default;

            const botComponent = components.get( data.telegramBotType );

            if ( !botComponent ) return window.Telegram?.WebApp?.close();

            await botComponent.runWebApp( this, data );
        },
    },
};
</script>
