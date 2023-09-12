class TelegramRegistry {
    #botTypes = {};

    // public
    registerBotType ( component ) {
        if ( this.#botTypes[component.type] ) {
            if ( this.#botTypes[component.type] === component ) return;

            throw Error( `Telegram bot type ${component.type} already registered` );
        }

        this.#botTypes[component.type] = component;
    }

    getBotType ( type ) {
        return this.#botTypes[type];
    }
}

export default new TelegramRegistry();
