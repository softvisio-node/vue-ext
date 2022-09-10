<script>
import ChangePasswordDialog from "#lib/components/change-password.dialog";

export default {
    "extends": ChangePasswordDialog,

    "props": {
        "userId": {
            "type": String,
            "required": true,
        },
        "userName": {
            "type": String,
            "required": true,
        },
    },

    "computed": {
        title () {
            return this.i18nd( `vue-ext`, `Change password` ) + ": " + this.userName;
        },
    },

    "methods": {
        async _changePassword ( password ) {
            return this.$api.call( "admin/users/set-password", this.userId, password );
        },
    },
};
</script>
