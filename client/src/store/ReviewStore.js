import { makeAutoObservable } from 'mobx';
import {
    fetchReviews,
    createReview,
    deleteReview,
    fetchUserReviews,
    updateReviewStatus
  } from '../http/reviewAPI';import { $authHost } from '../http';

export default class ReviewStore {
    reviews = [];
    userReviews = [];
    constructor() {
        makeAutoObservable(this);
    }

    async loadReviews() {
        try {
            const response = await $authHost.get('api/review/admin');
            this.reviews = response.data;
        } catch (error) {
            console.error("Ошибка при загрузке отзывов:", error);
            throw error;
        }
    }

    async loadUserReviews() {
        try {
            this.userReviews = await fetchUserReviews();
        } catch (error) {
            console.error("Ошибка при загрузке отзывов пользователя:", error);
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

    async updateReviewStatus(id, status) {
        try {
            const updatedReview = await updateReviewStatus(id, status);
            this.reviews = this.reviews.map(review =>
                review.id === id ? { ...review, status } : review
            );
            return updatedReview;
        } catch (error) {
            console.error("Ошибка при обновлении статуса отзыва:", error);
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

