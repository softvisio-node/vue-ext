class TelegramRegistry {
    #botTypes = {};

    // public
    registerBotType ( component ) {
        this.#botTypes[component.type] = component;
    }

    getBotType ( type ) {
        return this.#botTypes[type];
    }
}

export default new TelegramRegistry();
