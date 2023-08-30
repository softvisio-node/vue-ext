<template>
    <CardsPanel ref="cardsPanel" @refresh="refresh">
        <template #data>
            <ext-panel ref="dataPanel" layout="fit" viewModel="true">
                <ext-toolbar docked="top">
                    <ext-spacer/>
                    <ext-button bind='{"hidden":"{!record.can_update_acl}"}' :text="l10n(`vue-ext`, `Edit permissions`)" @tap="_showAclDialog"/>
                    <ext-button iconCls="fa-solid fa-redo" :text="l10nd(`vue-ext`, `Refresh`)" @tap="refresh"/>
                </ext-toolbar>

                <ext-panel defaults='{"labelAlign":"left","labelWidth":200}' padding="10 10 10 10" scrollable="true">
                    <ext-displayfield bind="{record.telegram_username}" :label="l10n(`vue-ext`, `Telegram username`)"/>

                    <ext-container layout="hbox">
                        <ext-displayfield bind="{record.url}" :label="l10n(`vue-ext`, `Telegram bot url`)" labelAlign="left" labelWidth="200"/>
                        <ext-spacer/>
                        <ext-button iconCls="fa-regular fa-copy" :tooltip="l10n(`vue-ext`, `Copy to the clipboard`)" @tap="_copyBotUrl"/>
                        <ext-button iconCls="fa-solid fa-arrow-up-right-from-square" :tooltip="l10n(`vue-ext`, `Open bot in Tekegram`)" @tap="_openBotUrl"/>
                    </ext-container>

                    <ext-container layout="hbox">
                        <ext-displayfield bind="{record.name}" :label="l10n(`vue-ext`, `Bot name`)" labelAlign="left" labelWidth="200"/>

                        <ext-spacer/>

                        <ext-button bind='{"hidden":"{!record.can_update}"}' iconCls="fa-solid fa-pen-to-square" :text="l10nd(`vue-ext`, `Edit`)" @tap="_shoeEditDialog"/>
                    </ext-container>

                    <ext-displayfield bind="{record.short_description}" :label="l10n(`vue-ext`, `Short description`)"/>

                    <!-- <ext-displayfield bind="{record.type}" :label="l10n(`vue-ext`, `Type`)"/> -->

                    <!-- <ext-displayfield bind="{record.static}" :label="l10n(`vue-ext`, `Static`)"/> -->

                    <!-- <ext-displayfield bind="{record.created}" :label="l10n(`vue-ext`, `Creation date`)" renderer="Ext.util.Format.dateRenderer('dateStyle:short,timeStyle:short')"/> -->

                    <!-- status -->
                    <ext-displayfield bind="{record.status_text}" :label="l10n(`vue-ext`, `Status`)" labelAlign="left" labelWidth="200"/>
                    <ext-displayfield bind='{"hidden":"{!record.error}","value":"{record.error_text}"}' labelAlign="left" labelWidth="200"/>

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

                    <ext-container defaults='{"ui":"decline","width":200}' layout='{"align":"center","type":"vbox"}'>
                        <!-- start -->
                        <ext-button bind='{"hidden":"{!record.can_start}"}' iconCls="fa-regular fa-circle-play" :text="l10nd(`vue-ext`, `Start bot`)" @tap="_startBot"/>

                        <!-- stop -->
                        <ext-button bind='{"hidden":"{!record.can_stop}"}' iconCls="fa-regular fa-circle-stop" :text="l10nd(`vue-ext`, `Stop bot`)" @tap="_stopBot"/>

                        <!-- change api key -->
                        <ext-button bind='{"hidden":"{!record.can_change_api_key}"}' iconCls="fa-solid fa-trash-alt" :text="l10nd(`vue-ext`, `Change bot API key`)" @tap="_deleteBot"/>

                        <!-- delete bot -->
                        <ext-button bind='{"hidden":"{!record.can_delete}"}' iconCls="fa-solid fa-trash-alt" :text="l10nd(`vue-ext`, `Delete bot`)" @tap="_deleteBot"/>
                    </ext-container>
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

        async _deleteBot ( e ) {
            if ( !( await this.$utils.confirm( this.l10nd( `vue-ext`, "Are you sure you want to delete this bot and all it's data? This operation is not revertable." ) ) ) ) return;

            const record = this.record,
                button = e.detail.sender;

            button.disable();

            const res = await this.$api.call( "telegram/bots/delete-bot", record.id );

            button.enable();

            if ( res.ok ) {
                this.refresh();
            }
            else {
                this.$utils.toast( res );
            }
        },

        _copyBotUrl () {
            this.$utils.copyToClipboard( this.record.get( "url" ) );

            this.$utils.toast( this.l10nd( `vue-ext`, "Telegram link copied to the clipboard" ) );
        },

        _openBotUrl () {
            this.$utils.clickUrl( this.record.get( "url" ) );
        },
    },
};
</script>
