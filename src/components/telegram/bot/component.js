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
        window.Telegram.WebApp.close();
    }
}
