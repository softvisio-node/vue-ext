<template>
    <div/>
</template>

<script>
import "./assets/scrollbars.css";
import extAdd from "./mixins/ext-add";
import RecoverPasswordDialog from "./recover-password-dialog";
import AppConnectFailureDialog from "./app-connect-failure-dialog";

export default {
    "mixins": [extAdd],

    "data": () => {
        return {
            "connectionFailureDialog": AppConnectFailureDialog,
            "defaultMask": null,
            "privateView": null,
            "publicView": null,

            "pushNotifications": null,
        };
    },

    "computed": {
        sessionIsAuthenticated () {
            return this.$store.getters["session/isAuthenticated"];
        },
    },

    mounted () {
        Ext.application( {
            "name": "app",
            "launch": this.ready.bind( this ),
        } );

        document.addEventListener( "deviceready", this._onCordovaDeviceReady.bind( this ), false );
    },

    "methods": {
        async ready () {
            var viewport = Ext.Viewport;

            while ( 1 ) {
                viewport.mask( this.defaultMask );

                var res = await this.$store.dispatch( "session/signin" );

                viewport.unmask();

                if ( res.isSuccess() ) break;

                const connectionFailureDialog = this.connectionFailureDialog;

                const wait = async function () {
                    return new Promise( function ( resolve ) {
                        const dialog = Ext.create( connectionFailureDialog );

                        dialog.show();

                        dialog.onClose = resolve;
                    } );
                };

                await wait();
            }

            this.$router.init( this );

            this.$router.route( this );

            this.$watch( "sessionIsAuthenticated", this.onAuthChange.bind( this ) );
        },

        onAuthChange () {
            this.$router.routeTo( "/", true );
        },

        async onRoute ( route ) {
            if ( route === "recover-password" ) {
                new RecoverPasswordDialog();
            }
            else {
                let view;

                if ( this.sessionIsAuthenticated ) {
                    if ( this.currentView === "private" ) return;

                    this.currentView = "private";
                    view = this.privateView;
                }
                else {
                    if ( this.currentView === "public" ) return;

                    this.currentView = "public";
                    view = this.publicView;
                }

                if ( view ) {
                    if ( this.view ) this.view.$destroy();

                    this.view = this.extAddVueComponent( view, Ext.Viewport );
                }
            }
        },

        _onCordovaDeviceReady () {
            this.registerPushNotifications();

            this.onCordovaDeviceReady();
        },

        registerPushNotifications () {
            const me = this;

            // push notification plugin is not present
            if ( !window.PushNotification ) return;

            this.pushNotifications = window.PushNotification.init( {
                "android": {
                    "sound": true,
                    "vibration": true,
                    "forceShow": true, // show notification, if app is in foreground mode
                    // topics: ['all-devel'],
                },
                "ios": {
                    "fcmSandbox": false, // set to true, if app is signed with the development certificate
                    "alert": true,
                    "sound": true,
                    "badge": true,
                },
                "browser": {},
                "windows": {},
            } );

            this.pushNotifications.on( "registration", function ( data ) {
                // var oldRegId = localStorage.getItem('registrationId');

                // if (oldRegId !== data.registrationId) {

                // save new registration ID
                // localStorage.setItem('registrationId', data.registrationId);

                // Post registrationId to your app server as the value has changed
                // }

                // unsubscribe from the topic
                me.pushNotifications.unsubscribe( "all", function () {
                    // subscribe to the topic
                    me.pushNotifications.subscribe( "all",
                        function () {
                            // subscribed
                        },
                        function ( error ) {
                            // subscription error
                            alert( "push error: " + error );
                        } );
                } );
            } );

            this.pushNotifications.on( "error", function ( e ) {
                alert( "push error: " + e.message );
            } );

            this.pushNotifications.on( "notification", function ( data ) {
                me.onPushNotification( data );

                // navigator.notification.alert(
                // data.message, // message
                // null, // callback
                // data.title, // title
                // 'Ok' // buttonName
                // );
            } );
        },

        // template method
        onCordovaDeviceReady () {},

        // template method
        onPushNotification ( data ) {},
    },
};
</script>
