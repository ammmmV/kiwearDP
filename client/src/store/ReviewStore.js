import { makeAutoObservable } from 'mobx';
import { fetchReviews, createReview } from '../http/reviewAPI';

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
}
export default new ReviewStore();
