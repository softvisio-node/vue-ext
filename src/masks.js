import loader from "./assets/loader.gif";

const loadMaask = {
    "transparent": false,
    "html": `<img src="${loader}" width="100"/>`,
    "indicator": false,
    "message": "",
};

class Masks {
    #globalLoadMask;

    get loadMask () {
        return loadMaask;
    }

    get globalLoadMask () {
        this.#globalLoadMask ??= new Ext.LoadMask( {
            ...loadMaask,
            "floated": true,
            "alwaysOnTop": true,
        } );

        return this.#globalLoadMask;
    }
}

export default new Masks();
