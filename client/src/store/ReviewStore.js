import { makeAutoObservable } from 'mobx';
import { fetchReviews, createReview } from '../http/reviewAPI';

class ReviewStore {
  reviews = [];
  constructor() {
    makeAutoObservable(this);
  }
  async loadReviews() {
    this.reviews = await fetchReviews();
  }
  async addReview(data) {
    const review = await createReview(data);
    this.reviews.push(review);
  }
}
export default new ReviewStore();
