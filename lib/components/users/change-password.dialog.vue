<script>
import ChangePasswordDialog from "#lib/components/change-password.dialog";

export default {
    "extends": ChangePasswordDialog,

    "props": {
        "userId": {
            "type": String,
            "required": true,
        },
        "username": {
            "type": String,
            "required": true,
        },
    },

    "computed": {
        header () {
            return this.i18nd( "vue-ext", `Change password for user` ) + `<br/><b>${this.username}</b>`;
        },
    },

    "methods": {
        async _changePassword ( password ) {
            return this.$api.call( "admin/users/set-password", this.userId, password );
        },
    },
};
</script>
