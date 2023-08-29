class TelegramRegistry {
    #types = {};

    // public
    register ( type, spec ) {
        this.#types[type] = spec;
    }

    getType ( type ) {
        return this.#types[type];
    }
}

export default new TelegramRegistry();
