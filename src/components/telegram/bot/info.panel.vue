<template>
    <CardsPanel ref="cardsPanel" @refresh="refresh">
        <template #data>
            <ext-panel ref="dataPanel" layout="fit" viewModel="true">
                <ext-toolbar docked="top">
                    <ext-spacer/>
                    <ext-button bind='{"hidden":"{!record.can_update_acl}"}' :text="l10n(`Edit permissions`, { domain: `vue-ext` })" @tap="_showAclDialog"/>
                    <ext-button iconCls="fa-solid fa-redo" :text="l10n(`Refresh`, { domain: `vue-ext` })" @tap="refresh"/>
                </ext-toolbar>

                <ext-panel padding="10 10 10 10" scrollable="true">
                    <ext-displayfield bind="{record.telegram_username}" :label="l10n(`Telegram username`, { domain: `vue-ext` })" labelAlign="left" labelWidth="200"/>

                    <ext-container layout="hbox">
                        <ext-displayfield bind="{record.url}" :label="l10n(`Telegram bot url`, { domain: `vue-ext` })" labelAlign="left" labelWidth="200"/>
                        <ext-spacer/>
                        <ext-button iconCls="fa-regular fa-copy" :tooltip="l10n(`Copy to the clipboard`, { domain: `vue-ext` })" @tap="_copyBotUrl"/>
                        <ext-button iconCls="fa-solid fa-arrow-up-right-from-square" :tooltip="l10n(`Open bot in Tekegram`, { domain: `vue-ext` })" @tap="_openBotUrl"/>
                    </ext-container>

                    <ext-container layout="hbox">
                        <ext-displayfield bind="{record.name}" :label="l10n(`Bot name`, { domain: `vue-ext` })" labelAlign="left" labelWidth="200"/>

                        <ext-spacer/>

                        <ext-button bind='{"hidden":"{!record.can_update}"}' iconCls="fa-solid fa-pen" :text="l10n(`Edit`, { domain: `vue-ext` })" @tap="_shoeEditDialog"/>
                    </ext-container>

                    <ext-displayfield bind="{record.short_description}" :label="l10n(`Short description`, { domain: `vue-ext` })" labelAlign="left" labelWidth="200"/>

                    <!-- <ext-displayfield bind="{record.type}" :label="l10n( `Type`, { domain: `vue-ext` } )"/> -->

                    <!-- <ext-displayfield bind="{record.static}" :label="l10n( `Static`, { domain: `vue-ext` } )"/> -->

                    <!-- <ext-displayfield bind="{record.created}" :label="l10n( `Creation date`, { domain: `vue-ext` } )" renderer="Ext.util.Format.dateRenderer('dateStyle:short,timeStyle:short')"/> -->

                    <!-- status -->
                    <ext-displayfield bind="{record.status_text}" :label="l10n(`Status`, { domain: `vue-ext` })" labelAlign="left" labelWidth="200"/>
                    <ext-displayfield bind='{"hidden":"{!record.error}","value":"{record.error_text}"}' labelAlign="left" labelWidth="200"/>

                    <!-- users stats -->
                    <ext-displayfield bind="{record.last_user_created_text}" :label="l10n(`Last new user subscribed`, { domain: `vue-ext` })" labelAlign="left" labelWidth="200"/>

                    <ext-fieldset layout="hbox" title="Users statistics">
                        <ext-container defaults='{"labelAlign":"left","labelWidth":200}' flex="1" layout="vbox">
                            <ext-displayfield bind="{record.total_users}" :label="l10n(`Total users`, { domain: `vue-ext` })"/>
                            <ext-displayfield bind="{record.total_subscribed_users_text}" :label="l10n(`Total subscribed users`, { domain: `vue-ext` })"/>
                            <ext-displayfield bind="{record.total_unsubscribed_users_text}" :label="l10n(`Total unsubscribed users`, { domain: `vue-ext` })"/>
                        </ext-container>

                        <ext-container defaults='{"labelAlign":"left","labelWidth":200}' layout="vbox">
                            <ext-displayfield bind="{record.total_returned_users}" :label="l10n(`Total returned users`, { domain: `vue-ext` })"/>
                            <ext-displayfield bind="{record.total_banned_users}" :label="l10n(`Total banned users`, { domain: `vue-ext` })"/>
                        </ext-container>
                    </ext-fieldset>

                    <ext-container defaults='{"ui":"decline","width":200}' layout='{"align":"center","type":"vbox"}'>
                        <!-- start -->
                        <ext-button bind='{"hidden":"{!record.can_start}"}' iconCls="fa-regular fa-circle-play" :text="l10n(`Start bot`, { domain: `vue-ext` })" @tap="_startBot"/>

                        <!-- stop -->
                        <ext-button bind='{"hidden":"{!record.can_stop}"}' iconCls="fa-regular fa-circle-stop" :text="l10n(`Stop bot`, { domain: `vue-ext` })" @tap="_stopBot"/>

                        <!-- change api key -->
                        <ext-button bind='{"hidden":"{!record.can_change_api_key}"}' iconCls="fa-solid fa-trash-alt" :text="l10n(`Change bot API key`, { domain: `vue-ext` })" @tap="_deleteBot"/>

                        <!-- delete bot -->
                        <ext-button bind='{"hidden":"{!record.can_delete}"}' iconCls="fa-solid fa-trash-alt" :text="l10n(`Delete bot`, { domain: `vue-ext` })" @tap="_deleteBot"/>
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
            if ( !( await this.$utils.confirm( this.l10n( "Are you sure you want to delete this bot and all it's data? This operation is not revertable." ) ) ) ) return;

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

            this.$utils.toast( this.l10n( "Telegram link copied to the clipboard" ) );
        },

        _openBotUrl () {
            this.$utils.clickUrl( this.record.get( "url" ) );
        },
    },
};
</script>
