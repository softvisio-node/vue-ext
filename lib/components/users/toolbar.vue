<template>
    <ext-toolbar docked="top">
        <ext-searchfield placeholder="search users" width="200" @change="search"/>
        <ext-spacer/>
        <ext-button iconCls="fas fa-user-plus" text="Create User" @tap="create"/>
        <ext-button iconCls="fas fa-redo" text="Refresh" @tap="refresh"/>
    </ext-toolbar>
</template>

<script>
import CreateUserDialog from "./create-user-dialog";

export default {
    data () {
        return {
            "store": this.$store.state.userStore,
        };
    },

    "methods": {
        search ( e ) {
            var val = e.detail.newValue.trim();

            if ( val !== "" ) {
                this.store.addFilter( {
                    "property": "search",
                    "operator": "like",
                    "value": val,
                },
                false );
            }
            else {
                this.store.removeFilter( "search" );
            }
        },

        refresh () {
            this.store.reload();
        },

        async create () {
            if ( !this.createUserDialog ) this.createUserDialog = await Ext.Viewport.addVue( CreateUserDialog );

            this.createUserDialog.$ext.show();
        },
    },
};
</script>
