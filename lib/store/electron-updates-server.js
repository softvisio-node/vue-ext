import Store from ".";
import ElectronUpdateModel from "../models/electron-update";

Ext.regStore( "electron-updates", {
    "model": ElectronUpdateModel,
    "autoLoad": false,
    "pageSize": 50,
} );

export default class extends Store {}
