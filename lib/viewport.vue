<template>
    <ext-panel viewport="true" layout="card" @ready="viewportReady"/>
</template>

<script>
import extAdd from "./mixins/ext-add";
import RecoverPasswordDialog from "./recover-password-dialog";
import AppConnectFailureDialog from "./app-connect-failure-dialog";

export default {
    "mixins": [extAdd],

    "data": () => {
        return {
            "pushNotifications": null,

            "viewport": null,
            "view": null,

            "defaultMask": null,
            "privateView": null,
            "publicView": null,
        };
    },

    "computed": {
        sessionIsAuthenticated () {
            return this.$store.getters["session/isAuthenticated"];
        },
    },

    mounted () {
        document.addEventListener( "deviceready", this._onCordovaDeviceReady.bind( this ), false );
    },

    "methods": {
        async viewportReady ( e ) {
            var me = this,
                viewport = ( this.viewport = e.detail.cmp ),
                initApp = async function () {
                    viewport.mask( me.defaultMask );

                    var res = await me.$store.dispatch( "session/signin" );

                    viewport.unmask();

                    if ( !res.isSuccess() ) {
                        const dialog = Ext.create( AppConnectFailureDialog, {
                            "onClose": initApp,
                        } );

                        dialog.show();
                    }
                    else {
                        me.route();
                    }
                };

            initApp();
        },

        route () {
            var me = this;

            this.$global.$on( "goto", function ( location ) {
                window.location.replace( location );

                me.route();
            } );

            const hash = window.location.hash;

            if ( hash ) {
                const found = hash.match( /^#[/]recover-password(?:(\/|$))/ );

                if ( found ) {
                    new RecoverPasswordDialog();

                    return;
                }
            }

            // window.onhashchange = this.route.bind( this );

            this.$watch( "sessionIsAuthenticated", this.watch.bind( this ) );

            this.watch();
        },

        watch () {
            const isAuthenticated = this.sessionIsAuthenticated;

            // authentication status is unknown
            if ( isAuthenticated === null ) return;

            var view;

            if ( isAuthenticated ) {
                view = this.privateView;
            }
            else {
                view = this.publicView;
            }

            if ( this.view ) this.view.$destroy();

            this.view = this.extAddVueComponent( view, this.viewport );
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

        // template methof
        onPushNotification ( data ) {},
    },
};
</script>
<!-- -----SOURCE FILTER LOG BEGIN----- -->
<!-- -->
<!-- +-------+---------------+------------------------------+--------------------------------------------------------------------------------+ -->
<!-- | Sev.  | Line:Col      | Rule                         | Description                                                                    | -->
<!-- |=======+===============+==============================+================================================================================| -->
<!-- |  WARN | 139:67        | no-unused-vars               | 'data' is defined but never used.                                              | -->
<!-- |-------+---------------+------------------------------+--------------------------------------------------------------------------------| -->
<!-- |  WARN | 184:30        | no-unused-vars               | 'data' is defined but never used.                                              | -->
<!-- +-------+---------------+------------------------------+--------------------------------------------------------------------------------+ -->
<!-- -->
<!-- -----SOURCE FILTER LOG END----- -->
