import { makeAutoObservable } from 'mobx';
import { fetchReviews, createReview, deleteReview } from '../http/reviewAPI';

class ReviewStore {
    reviews = [];
    constructor() {
        makeAutoObservable(this);
    }

    async loadReviews() {
        try {
            this.reviews = await fetchReviews();
        } catch (error) {
            console.error("Ошибка при загрузке отзывов:", error);
            throw error;
        }
    }

    async addReview(data) {
        try {
            const review = await createReview(data);
            this.reviews.push(review);
            return review;
        } catch (error) {
            console.error("Ошибка при добавлении отзыва:", error);
            throw error;
        }
    }

    async deleteReview(id) {
        try {
            await deleteReview(id);
            this.reviews = this.reviews.filter(review => review.id !== id);
        } catch (error) {
            console.error("Ошибка при удалении отзыва:", error);
            throw error;
        }
    }
}

export default new ReviewStore();
