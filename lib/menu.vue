<template>
    <ext-sheet layout="vbox" side="right" modal="true" displayed="false" cover="true" reveal="false" width="300" @ready="ready">
        <ext-panel layout="vbox" height="130" padding="30 10 10 30" innerCls="x-tabbar">
            <ext-image :src="avatar" width="60" height="60"/>
            <!-- <ext&#45;container> -->
            <!--     <div class="username"> -->
            <!--         {{ userName }} -->
            <!--     </div> -->
            <!-- </ext&#45;container> -->
        </ext-panel>

        <ext-panel layout="vbox" flex="1" padding="10 10 10 30">
            <slot/>

            <ext-spacer/>

            <ext-button iconCls="fas fa-sign-out-alt" text="Sign Out" textAlign="left" @tap="signout"/>

            <ext-togglefield label="DARK MODE" labelAlign="right" :value="darkMode" width="150" @change="darkMode = $event"/>
        </ext-panel>
    </ext-sheet>
</template>

<script>
export default {
    "computed": {
        avatar () {
            return this.$store.getters["session/avatar"];
        },

        userName () {
            return this.$store.getters["session/userName"];
        },

        "darkMode": {
            get () {
                return this.$store.getters["session/darkMode"];
            },

            set ( ev ) {
                this.$store.commit( "session/darkMode", ev.detail.newValue );
            },
        },
    },

    "methods": {
        ready ( e ) {
            this.cmp = e.detail.cmp;

            // disable viewport gestures, menu can be opened only by button click
            Ext.Viewport.addedSwipeListener = true;
        },

        show () {
            this.cmp.show();
        },

        hide () {
            this.cmp.hide();
        },

        signout () {
            this.hide();

            this.$store.dispatch( "session/signout" );
        },
    },
};
</script>
