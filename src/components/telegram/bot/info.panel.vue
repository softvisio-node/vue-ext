<template>
    <CardsPanel ref="cardsPanel" @refresh="refresh">
        <template #data>
            <ext-panel ref="dataPanel" layout="fit" viewModel="true">
                <ext-toolbar docked="top">
                    <ext-spacer/>
                    <ext-button iconCls="fa-solid fa-redo" :text="l10nd(`vue-ext`, `Refresh`)" @tap="refresh"/>
                </ext-toolbar>

                <ext-panel defaults='{"labelAlign":"left","labelWidth":200}' padding="10 10 10 10" scrollable="true">
                    <ext-displayfield bind="{record.telegram_username}" :label="l10n(`vue-ext`, `Telegram username`)"/>

                    <ext-container layout="hbox">
                        <ext-displayfield bind="{record.name}" :label="l10n(`vue-ext`, `Bot name`)" labelAlign="left" labelWidth="200"/>

                        <ext-spacer/>

                        <ext-button bind='{"hidden":"{!record.can_update}"}' iconCls="fa-solid fa-pen-to-square" :text="l10nd(`vue-ext`, `Edit`)" @tap="_shoeEditDialog"/>
                    </ext-container>

                    <ext-displayfield bind="{record.short_description}" :label="l10n(`vue-ext`, `Short description`)"/>

                    <!-- <ext-displayfield bind="{record.type}" :label="l10n(`vue-ext`, `Type`)"/> -->

                    <!-- <ext-displayfield bind="{record.static}" :label="l10n(`vue-ext`, `Static`)"/> -->

                    <!-- <ext-displayfield bind="{record.created}" :label="l10n(`vue-ext`, `Creation date`)" renderer="Ext.util.Format.dateRenderer('dateStyle:short,timeStyle:short')"/> -->

                    <!-- acl -->
                    <ext-container bind='{"hidden":"{!record.can_update_acl}"}' layout="hbox">
                        <ext-spacer width="200"/>
                        <ext-button :text="l10n(`vue-ext`, `Edit permissions`)" ui="action" @tap="_showAclDialog"/>
                    </ext-container>

                    <!-- status -->
                    <ext-fieldset defaults='{"labelAlign":"left","labelWidth":200}'>
                        <ext-displayfield bind="{record.status_text}" :label="l10n(`vue-ext`, `Status`)"/>

                        <ext-displayfield bind='{"hidden":"{!record.error}","value":"{record.error_text}"}'/>

                        <ext-container bind='{"hidden":"{!record.can_update}"}' layout="hbox">
                            <ext-spacer width="200"/>

                            <ext-button bind='{"hidden":"{record.started}"}' iconCls="fa-regular fa-circle-play" :text="l10nd(`vue-ext`, `Start bot`)" ui="action" width="200" @tap="_startBot"/>

                            <ext-button bind='{"hidden":"{!record.started}"}' iconCls="fa-regular fa-circle-stop" :text="l10nd(`vue-ext`, `Stop bot`)" ui="action" width="200" @tap="_stopBot"/>
                        </ext-container>
                    </ext-fieldset>

                    <!-- users stats -->
                    <ext-displayfield bind="{record.last_user_created_text}" :label="l10n(`vue-ext`, `Last new user subscribed`)"/>

                    <ext-fieldset layout="hbox" title="Users statistics">
                        <ext-container defaults='{"labelAlign":"left","labelWidth":200}' flex="1" layout="vbox">
                            <ext-displayfield bind="{record.total_users}" :label="l10n(`vue-ext`, `Total users`)"/>
                            <ext-displayfield bind="{record.total_subscribed_users_text}" :label="l10n(`vue-ext`, `Total subscribed users`)"/>
                            <ext-displayfield bind="{record.total_unsubscribed_users_text}" :label="l10n(`vue-ext`, `Total unsubscribed users`)"/>
                        </ext-container>

                        <ext-container defaults='{"labelAlign":"left","labelWidth":200}' layout="vbox">
                            <ext-displayfield bind="{record.total_returned_users}" :label="l10n(`vue-ext`, `Total returned users`)"/>
                            <ext-displayfield bind="{record.total_banned_users}" :label="l10n(`vue-ext`, `Total banned users`)"/>
                        </ext-container>
                    </ext-fieldset>
                </ext-panel>
            </ext-panel>
        </template>
    </CardsPanel>
</template>

<script>
import CardsPanel from "#src/components/cards.panel";
import TelegramBotModel from "./models/bot";
import AclDialog from "#vue/components/acl/dialog";
import DetailsGialog from "./details.dialog";

export default {
    "components": { CardsPanel },

    "props": {
        "telegramBotId": {
            "type": String,
            "required": true,
        },
    },

    "methods": {
        async refresh () {
            this.$refs.cardsPanel.mask();

            const res = await this.$api.call( "telegram/bots/get-bot", this.telegramBotId );

            this.$refs.cardsPanel.setResult( res );

            if ( res.ok ) {
                const record = new TelegramBotModel( res.data );

                this.record = record;

                this.$refs.dataPanel.ext.getViewModel().set( "record", record );
            }
        },

        // protected
        async _startBot ( e ) {
            const button = e.detail.sender,
                record = this.record;

            button.disable();

            const res = await this.$api.call( "telegram/bots/set-bot-started", record.id, true );

            button.enable();

            if ( res.ok ) {
                record.set( "started", true );
                record.set( "error", false );
                record.set( "error_text", null );
            }
            else {
                this.$utils.toast( res );
                record.set( "error", true );
                record.set( "error_text", res.statusText );
            }

            record.commit( false, ["started", "error", "error_text"] );
        },

        async _stopBot ( e ) {
            const button = e.detail.sender,
                record = this.record;

            button.disable();

            const res = await this.$api.call( "telegram/bots/set-bot-started", record.id, false );

            button.enable();

            if ( res.ok ) {
                record.set( "started", false );
                record.commit( false, ["started"] );
            }
            else {
                this.$utils.toast( res );
            }
        },

        async _showAclDialog () {
            const cmp = await this.$mount( AclDialog, {
                "cache": false,
                "props": {
                    "aclId": this.record.get( "acl_id" ),
                },
            } );

            cmp.ext.show();
        },

        async _shoeEditDialog () {
            const cmp = await this.$mount( DetailsGialog, {
                "props": {
                    "record": this.record,
                },
            } );

            cmp.ext.show();
        },
    },
};
</script>
