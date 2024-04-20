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
        if ( data.webAppType === "bot-statistics" ) {
            return this.#runBotStatisticsWebApp( panel, data );
        }
        else if ( data.webAppType === "wallet-pay" ) {
            return this.#runWalletPayWebApp( panel, data );
        }
        else {
            return this._runWebApp( panel, data );
        }
    }

    // protected
    async _runWebApp ( panel, data ) {
        return window.Telegram.WebApp.close();
    }

    // private
    async #runBotStatisticsWebApp ( panel, data ) {
        return panel.$mount( import( "#vue/components/telegram/bot/details/charts.panel" ), {
            "props": {
                "telegramBotId": data.telegramBotId,
                "showMaximizeButton": false,
            },
        } );
    }

    async #runWalletPayWebApp ( panel, data ) {
        if ( !data.data.return ) {

            // XXX check order

            // XXX create wallet pay order, specify returnUrl, failedReturnUrl

            // XXX open wallet pay url
            window.Telegram.WebApp.openTelegramLink( "https://t.me/wallet/start?startapp=wpay_order-orderId__10774459298049&startApp=wpay_order-orderId__10774459298049" );
        }
        else {

            // XXX checj order status
        }
    }
}
