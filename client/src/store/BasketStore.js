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
        this.fetchBasket();
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

    async addToBasket(data) {
        try {
            this.setLoading(true);
    
            if (!data || !data.patternId) {
                throw new Error('Не указан паттерн');
            }
    
            if (!localStorage.getItem('token')) {
                alert('АВТОРИЗУЙСЯ');
                return;
            }
    
            console.log('Token:', localStorage.getItem('token'));
            const response = await $authHost.post('api/basket', {
                patternId: data.patternId
            });
    
            if (response.data) {
                const newItem = response.data;
                const existingItemIndex = this._basket.findIndex(
                    i => i.patternId === newItem.patternId
                );
    
                if (existingItemIndex !== -1) {
                    const updatedBasket = [...this._basket];
                    updatedBasket[existingItemIndex].quantity = newItem.quantity;
                    this.setBasket(updatedBasket);
                } else {
                    this.setBasket([...this._basket, newItem]);
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
            const updatedBasket = this._basket.filter(item => item.id !== id);
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
        return this._basket.reduce((sum, item) => {
            const price = item.pattern ? parseFloat(item.pattern.price) : 0;
            return sum + (price * item.quantity);
        }, 0);
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
            if (!localStorage.getItem('token')) {
                return;
            }
            const response = await $authHost.get('api/basket');
            if (response.data) {
                this.setBasket(response.data);
            }
        } catch (e) {
            console.error('Ошибка при получении корзины:', e.message);
        } finally {
            this.setLoading(false);
        }
    }
}
