<template>
    <ext-sheet layout="fit" side="right" modal="true" displayed="false" width="300" @ready="ready">
        <ext-panel ref="card" iconCls="far fa-bell" title="Notifications" layout="card">
            <ext-panel layout="center">
                <ext-container html='<div style="font-size:1.5em;">You have no notifications</div>'/>
            </ext-panel>
            <ext-panel layout="fit">
                <ext-list layout="vbox" scrollable="true" @ready="listReady"/>
            </ext-panel>
        </ext-panel>
    </ext-sheet>
</template>

<script>
export default {
    "emits": ["notificationsBadgeText"],

    mounted () {
        this.store = this.$store.notifications.store;

        this.store.on( "datachanged", this._onNotificationsLoad, this );
    },

    "methods": {
        ready ( e ) {
            this.ext = e.detail.cmp;

            this._onNotificationsLoad();
        },

        listReady ( e ) {
            const ext = e.detail.cmp;

            ext.setItemTpl( `<div><b>{title}</b><br/>{body}</b><br/>{date}</div>` );

            ext.setStore( this.store );
        },

        show () {
            this.ext.show();
        },

        hide () {
            this.ext.hide();
        },

        // protected
        _onNotificationsLoad () {
            const count = this.store.count();

            if ( !count ) {
                this.$refs.card.ext.setActiveItem( 0 );

                this.$emit( "notificationsBadgeText", "" );
            }
            else {
                this.$refs.card.ext.setActiveItem( 1 );

                this.$emit( "notificationsBadgeText", count );
            }
        },
    },
};
</script>
