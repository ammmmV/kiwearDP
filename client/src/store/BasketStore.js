import { makeAutoObservable } from "mobx";
import { $authHost } from "../http";

export default class BasketStore {

    _basket = [];
    _loading = false;
    currentUserEmail = "";

    constructor() {
        makeAutoObservable(this);
    }

    setCurrentUserEmail(email) {
        this.currentUserEmail = email;
        this.loadUserBasket();
    }

    setBasket(basket) {
        this._basket = basket;
        if (this.currentUserEmail) {
            localStorage.setItem(`basket_${this.currentUserEmail}`, JSON.stringify(basket));
        }
    }

    setLoading(loading) {
        this._loading = loading;
    }

    get basket() {
        return this._basket;
    }

    get loading() {
        return this._loading;
    }

    loadUserBasket() {
        if (this.currentUserEmail) {
            const localBasket = localStorage.getItem(`basket_${this.currentUserEmail}`);
            this._basket = localBasket ? JSON.parse(localBasket) : [];
        } else {
            this._basket = [];
        }
    }

    async addToBasket(pattern) {
        try {
            this.setLoading(true);
    
            if (!pattern || !pattern.id) {
                throw new Error('Не указан паттерн');
            }
    
            const item = {
                patternId: pattern.id,
                // name: pattern.name,
                // price: pattern.price,
                // img: pattern.img,
                quantity: 1
            };
    
            const existingItemIndex = this._basket.findIndex(
                i => i.patternId === item.patternId &&
                     i.name === item.name
            );
    
            if (existingItemIndex !== -1) {
                const updatedBasket = [...this._basket];
                updatedBasket[existingItemIndex].quantity += 1;
                this.setBasket(updatedBasket);
            } else {
                this.setBasket([...this._basket, item]);
            }
    
            if (localStorage.getItem('token')) {
                try {
                    await $authHost.post('api/basket', item);
                } catch (e) {
                    console.error('Ошибка при синхронизации с сервером:', e.response?.data || e.message);
                }
            }
        } catch (e) {
            console.error('Ошибка при добавлении в корзину:', e.message);
            throw e;
        } finally {
            this.setLoading(false);
        }
    }
    

    async removeFromBasket(id) {
        try {
            const updatedBasket = this._basket.filter(item => 
                item.id !== id && 
                // !(item.patternId === id.patternId && 
                //   item.typeId === id.typeId && 
                //   item.fabricId === id.fabricId)
                !(item.patternId === id.patternId)
            );
            this.setBasket(updatedBasket);

            if (localStorage.getItem('token')) {
                try {
                    await $authHost.delete(`api/basket/${id}`);
                } catch (e) {
                    console.error('Ошибка при синхронизации с сервером:', e);
                }
            }
        } catch (e) {
            console.error('Ошибка при удалении из корзины:', e);
        }
    }

    async updateQuantity(id, quantity) {
        if (quantity < 1) return;

        try {
            const updatedBasket = this._basket.map(item =>
                (item.id === id || 
                 (item.patternId === id.patternId))
                ? { ...item, quantity }
                : item
            );
            this.setBasket(updatedBasket);

            if (localStorage.getItem('token')) {
                try {
                    await $authHost.put(`api/basket/${id}`, { quantity });
                } catch (e) {
                    console.error('Ошибка при синхронизации с сервером:', e);
                }
            }
        } catch (e) {
            console.error('Ошибка при обновлении количества:', e);
        }
    }

    get totalPrice() {
        return this._basket.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    get itemCount() {
        return this._basket.reduce((count, item) => count + item.quantity, 0);
    }

    async clearBasket() {
        try {
            this.setLoading(true);
            this.setBasket([]);
            if (this.currentUserEmail) {
                localStorage.removeItem(`basket_${this.currentUserEmail}`);
            }

            if (localStorage.getItem('token')) {
                try {
                    await $authHost.delete('api/basket/clear');
                } catch (e) {
                    console.error('Ошибка при очистке корзины на сервере:', e);
                }
            }
        } catch (e) {
            console.error('Ошибка при очистке корзины:', e);
        } finally {
            this.setLoading(false);
        }
    }

    syncWithServer() {
        if (localStorage.getItem('token')) {
            this.fetchBasket();
        }
    }

    async fetchBasket() {
        try {
            this.setLoading(true);
            const { data } = await $authHost.get('api/basket');
            if (data && Array.isArray(data.basket_items)) {
                this.setBasket(data.basket_items);
            }
        } catch (e) {
            console.error('Ошибка при получении корзины:', e);
        } finally {
            this.setLoading(false);
        }
    }
}
