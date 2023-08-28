<template>
    <CardsPanel ref="cardsPanel" @refresh="refresh">
        <template #data>
            <ext-panel ref="dataPanel" layout="fit" viewModel="true">
                <ext-toolbar docked="top">
                    <ext-spacer/>
                    <ext-button iconCls="fa-solid fa-redo" :text="l10nd(`vue-ext`, `Refresh`)" @tap="refresh"/>
                </ext-toolbar>

                <ext-panel defaults='{"labelAlign":"left","labelWidth":200}' padding="10 10 10 10" scrollable="true">
                    <ext-field bind="{record.name}" :label="l10n(`vue-ext`, `Bot name`)"/>

                    <ext-fieldset>
                        <!-- view contaoner -->
                        <ext-container defaults='{"labelAlign":"left","labelWidth":200}' :hidden="edit" layout="vbox">
                            <ext-displayfield bind="{record.telegram_username}" :label="l10n(`vue-ext`, `Telegram username`)"/>

                            <ext-displayfield bind="{record.short_description}" :label="l10n(`vue-ext`, `Short description`)"/>

                            <ext-displayfield bind="{record.description}" :label="l10n(`vue-ext`, `Description`)"/>

                            <ext-container bind='{"hidden":"{!record.can_update}"}' layout="hbox">
                                <ext-spacer width="200"/>

                                <ext-button iconCls="fa-solid fa-pen-to-square" :text="l10nd(`vue-ext`, `Edit`)" width="200" @tap="_startEdit"/>
                            </ext-container>
                        </ext-container>

                        <!--  edot container -->
                        <ext-container defaults='{"labelAlign":"left","labelWidth":200}' :hidden="!edit" layout="vbox">
                            <ext-textfield bind="{record.telegram_username}" :label="l10n(`vue-ext`, `Telegram username`)"/>

                            <ext-textfield bind="{record.short_description}" :label="l10n(`vue-ext`, `Short description`)"/>

                            <ext-textareafield bind="{record.description}" :label="l10n(`vue-ext`, `Description`)"/>

                            <ext-container bind='{"hidden":"{!record.can_update}"}' layout="hbox">
                                <ext-spacer width="200"/>

                                <ext-button iconCls="fa-solid fa-pen-to-square" :text="l10nd(`vue-ext`, `Save`)" width="200" @tap="_save"/>
                                <ext-button iconCls="fa-solid fa-pen-to-square" :text="l10nd(`vue-ext`, `Cancel`)" width="200" @tap="_cancelEdit"/>
                            </ext-container>
                        </ext-container>
                    </ext-fieldset>

                    <!-- <ext-displayfield bind="{record.type}" :label="l10n(`vue-ext`, `Type`)"/> -->

                    <!-- <ext-displayfield bind="{record.static}" :label="l10n(`vue-ext`, `Static`)"/> -->

                    <!-- <ext-displayfield bind="{record.created}" :label="l10n(`vue-ext`, `Creation date`)" renderer="Ext.util.Format.dateRenderer('dateStyle:short,timeStyle:short')"/> -->

                    <!-- status -->
                    <ext-fieldset defaults='{"labelAlign":"left","labelWidth":200}'>
                        <ext-displayfield bind="{record.status_text}" :label="l10n(`vue-ext`, `Status`)"/>

                        <ext-displayfield bind='{"hidden":"{!record.error}","value":"{record.error_text}"}'/>

                        <ext-container bind='{"hidden":"{!record.can_update}"}' layout="hbox">
                            <ext-spacer width="200"/>

                            <ext-button bind='{"hidden":"{record.started}"}' iconCls="fa-regular fa-circle-play" :text="l10nd(`vue-ext`, `Start`)" ui="action" width="200" @tap="_startBot"/>

                            <ext-button bind='{"hidden":"{!record.started}"}' iconCls="fa-regular fa-circle-stop" :text="l10nd(`vue-ext`, `ui=actionStop`)" ui="action" width="200" @tap="_stopBot"/>
                        </ext-container>
                    </ext-fieldset>

                    <!-- users stats -->
                    <ext-fieldset layout="hbox" title="Users statistics">
                        <ext-container defaults='{"labelAlign":"left","labelWidth":200}' flex="1" layout="vbox">
                            <ext-displayfield bind="{record.total_users}" :label="l10n(`vue-ext`, `Total users`)"/>
                            <ext-displayfield bind="{record.total_subscribed_users}" :label="l10n(`vue-ext`, `Total subscribed users`)"/>
                            <ext-displayfield bind="{record.total_unsubscribed_users}" :label="l10n(`vue-ext`, `Total unsubscribed users`)"/>
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

export default {
    "components": { CardsPanel },

    "props": {
        "telegramBotId": {
            "type": String,
            "required": true,
        },
    },

    deta () {
        return {
            "edit": false,
        };
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
        _startEdit () {
            this.edit = true;
        },

        _cancelEdit () {
            this.edit = false;
        },

        async _save () {
            this.edit = false;
        },

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
        },

        async _stopBot ( e ) {
            const button = e.detail.sender,
                record = this.record;

            button.disable();

            const res = await this.$api.call( "telegram/bots/set-bot-started", record.id, false );

            button.enable();

            if ( res.ok ) {
                record.set( "started", false );
            }
            else {
                this.$utils.toast( res );
            }
        },
    },
};
</script>
