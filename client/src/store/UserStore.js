import { makeAutoObservable } from "mobx";

export default class UserStore {
    constructor() {
        this._isAuth = false
        this._user = {}
        this._role = {}
        this._basketCount = 0;        
        makeAutoObservable(this)
    }

    setIsAuth(bool) {
        this._isAuth = bool
    }
    setUser(user) {
        this._user = user
        if (user && typeof user.basketCount === 'number') {
            this.setBasketCount(user.basketCount);
        }
    }
    setRole(role) {
        this._role = role
    }

    setBasketCount(count) {
        this._basketCount = count;
    }

    get isAuth() {
        return this._isAuth
    }
    get user() {
        return this._user
    }
    get role() {
        return this._role
    }
    get basketCount() { 
        return this._basketCount;
    }
}
