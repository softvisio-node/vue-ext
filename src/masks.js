import loader from "./assets/loader.gif";

const loadMaask = {
    "transparent": false,
    "html": `<img src="${loader}" width="100"/>`,
    "indicator": false,
    "message": "",
};

class Masks {
    #loadMask = new Ext.LoadMask( loadMaask );

    #globalLoadMask = new Ext.LoadMask( {
        ...loadMaask,
        "floated": true,
        "alwaysOnTop": true,
    } );

    get loadMask () {
        return this.#loadMask;
    }

    get globalLoadMask () {
        return this.#globalLoadMask;
    }
}

export default new Masks();
