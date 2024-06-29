import telegramComponents from "#src/components/telegram/components";
import TelegramComponentModel from "./models/component";

export default class TelegramBotComponent {
    model;

    constructor () {
        this.model = new TelegramComponentModel( {
            "id": this.id,
        } );

        telegramComponents.add( this );
    }

    // propertirs
    get id () {
        throw `Bot id is reqiored`;
    }

    get name () {
        return this.model.get( "name" );
    }

    get description () {
        return this.model.get( "description" );
    }

    get shortDescription () {
        return this.model.get( "short_description" );
    }

    get panel () {
        return import( "./panel" );
    }

    // public
    async runWebApp ( panel, data ) {
        if ( data.webAppType === "bot-statistics" ) {
            return this._runBotStatisticsWebApp( panel, data );
        }
        else {
            return this._runWebApp( panel, data );
        }
    }

    // protected
    async _runWebApp ( panel, data ) {
        return window.Telegram.WebApp.close();
    }

    async _runBotStatisticsWebApp ( panel, data ) {
        return panel.$mount( import( "#vue/components/telegram/bot/details/charts.panel" ), {
            "props": {
                "telegramBotId": data.telegramBotId,
                "showMaximizeButton": false,
            },
        } );
    }
}
