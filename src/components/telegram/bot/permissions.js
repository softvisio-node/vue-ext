import app from "#app";

export default class {
    #permissions;

    constructor ( permissions ) {
        this.#permissions = new Set( permissions );
    }

    // public
    has ( permission ) {
        return this.#permissions.has( permission ) || app.user.hasPermissions( permission );
    }
}
