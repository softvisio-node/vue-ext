import telegramComponents from "#src/components/telegram/components";
import TelegramComponentModel from "./models/component";

export default class TelegramBotComponent {
    #model;

    constructor () {
        telegramComponents.add( this );
    }

    // propertirs
    get id () {
        throw `Bot id is reqiored`;
    }

    get name () {
        throw `Bot name is reqiored`;
    }

    get shortDescription () {
        return this.description;
    }

    get description () {
        return this.name;
    }

    get model () {
        this.#model ??= new TelegramComponentModel( {
            "id": this.id,
            "name": this.name,
            "short_description": this.shortDescription,
            "description": this.description,
        } );

        return this.#model;
    }

    get panel () {
        return import( "./details/panel" );
    }

    // public
    async runWebApp ( panel, data ) {
        if ( data.data.type === "bot-statistics" ) {
            await panel.$mount( import( "#vue/components/telegram/bot/details/charts.panel" ), {
                "props": {
                    "telegramBotId": data.telegramBotId,
                    "showMaximizeButton": false,
                },
            } );
        }
        else if ( data.data.type === "wallet-pay" ) {

            // XXX check order

            // XXX create wallet pay order, specify returnUrl, failedReturnUrl

            // XXX open wallet pay url
            window.Telegram.WebApp.openTelegramLink( "https://t.me/wallet/start?startapp=wpay_order-orderId__10774459298049&startApp=wpay_order-orderId__10774459298049" );
        }
        else {
            return this._runWebApp( panel, data );
        }
    }

    // protected
    async _runWebApp ( panel, data ) {
        return window.Telegram.WebApp.close();
    }
}
