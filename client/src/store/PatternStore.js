import { makeAutoObservable } from "mobx";

export default class PatternStore {
    constructor() {
        this._types = []
        this._fabrics = []
        this._patterns = []
        this._selectedType = {}
        this._selectedFabric = {}
        this._page = 1
        this._totalCount = 0
        this._limit = 3
        makeAutoObservable(this)
    }

    setTypes(types) {
        this._types = types
    }
    setFabrics(fabrics) {
        this._fabrics = fabrics
    }
    setPatterns(patterns) {
        this._patterns = patterns
    }
    setSelectedType(type) {
        this.setPage(1)
        this._selectedType = type
    }
    setSelectedFabric(fabric) {
        this.setPage(1)
        this._selectedFabric = fabric
    }
    setPage(page) {
        this._page = page
    }
    setTotalCount(count) {
        this._totalCount = count
    }

    get types() {
        return this._types
    }
    get fabrics() {
        return this._fabrics
    }
    get patterns() {
        return this._patterns
    }
    get selectedType() {
        return this._selectedType
    }
    get selectedFabric() {
        return this._selectedFabric
    }
    get totalCount() {
        return this._totalCount
    }
    get page() {
        return this._page
    }
    get limit() {
        return this._limit
    }
}
