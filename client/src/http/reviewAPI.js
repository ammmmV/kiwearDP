import {$authHost} from './index';

export const createReview = async (review) => {
  const { data } = await $authHost.post('/api/review', review);
  return data;
};

export const fetchReviews = async () => {
  const { data } = await $authHost.get('/api/review');
  return data;
};
