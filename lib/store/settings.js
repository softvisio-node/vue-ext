import Store from "@softvisio/vue/store";
import SettingsModel from "../models/settings";

export default class extends Store {
    record;

    get model () {
        return SettingsModel;
    }

    async reload () {
        var res = await this.$api.call( "admin/settings/read" );

        if ( !res.ok ) {
            return res;
        }
        else {
            res.data = Ext.create( this.model, res.data );

            this.record = res.data;

            return res;
        }
    }

    async testSmtp () {
        const record = this.record;

        const values = {

            //
            "smtp_host": record.get( "smtp_host" ),
            "smtp_port": record.get( "smtp_port" ),
            "smtp_username": record.get( "smtp_username" ),
            "smtp_password": record.get( "smtp_password" ),
            "smtp_tls": record.get( "smtp_tls" ),
        };

        const res = await this.$api.call( "admin/settings/test-smtp", values );

        return res;
    }
}
