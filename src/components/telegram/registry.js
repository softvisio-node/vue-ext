class TelegramRegistry {
    #botTypes = {};

    // public
    registerBotType ( type, spec ) {
        this.#botTypes[type] = spec;
    }

    getBotType ( type ) {
        return this.#botTypes[type];
    }
}

export default new TelegramRegistry();
