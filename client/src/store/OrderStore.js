import { makeAutoObservable } from "mobx";
import { $authHost } from "../http";

export default class OrderStore {
    _orders = [];
    _loading = false;
    _error = null;

    constructor() {
        makeAutoObservable(this);
    }

    setCurrentUserEmail(email) {
        this.currentUserEmail = email;
        this.fetchBasket();
    }

    setOrders(orders) {
        this._orders = orders;
        if (this.currentUserEmail) {
            localStorage.setItem(`orders_${this.currentUserEmail}`, JSON.stringify(orders));
        }
    }

    setLoading(loading) {
        this._loading = loading;
    }

    setError(error) {
        this._error = error;
    }

    resetOrders() {
        this._orders = [];
    }

    get orders() {
        return this._orders;
    }

    get orderCount() {
        return this._orders.length;
    }

    get loading() {
        return this._loading;
    }

    get error() {
        return this._error;
    }

    loadUserOrders() {
        if (this.currentUserEmail) {
            const localOrder = localStorage.getItem(`order_${this.currentUserEmail}`);
            this._order = localOrder ? JSON.parse(localOrder) : [];
        } else {
            this._order = [];
        }
    }

    async createOrder(orderData) {
        try {
            this.setLoading(true);
            this.setError(null);
    
            const response = await $authHost.post('/api/order', orderData);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Ошибка при создании заказа';
            this.setError(message);
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    syncWithServer() {
        if (localStorage.getItem('token')) {
            this.fetchOrders();
        }
    }
    
    async fetchOrders() {
        try {
            this.setLoading(true);
            this.setError(null);
    
            const response = await $authHost.get('/api/order');
            this.setOrders(response.data);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Ошибка при получении заказов';
            this.setError(message);
            throw error;
        } finally {
            this.setLoading(false);
        }
    }
    
    async getOneOrder(id) {
        try {
            this.setLoading(true);
            this.setError(null);
    
            const response = await $authHost.get(`/api/order/${id}`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Ошибка при получении заказа';
            this.setError(message);
            throw error;
        } finally {
            this.setLoading(false);
        }
    }
}
