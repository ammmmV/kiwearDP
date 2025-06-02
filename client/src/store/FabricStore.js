import { makeAutoObservable } from 'mobx';

export default class FabricStore {
    constructor() {
        this._fabrics = []; 
        this._selectedFabric = {};
        makeAutoObservable(this);
    }

    setFabrics(fabrics) {
        this._fabrics = fabrics;
    }

    setSelectedFabric(fabric) {
        this._selectedFabric = fabric;
    }

    get fabrics() {
        return this._fabrics;
    }

    get selectedFabric() {
        return this._selectedFabric;
    }
}