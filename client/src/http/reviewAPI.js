import { $authHost, $host } from "./index";

export const createReview = async (review) => {
  const { data } = await $authHost.post('/api/review', review);
  return data;
};

export const fetchReviews = async () => {
  const { data } = await $authHost.get('/api/review');
  return data;
};

export const deleteReview = async (id) => {
  try {
      const { data } = await $authHost.delete('api/review/' + id);
      return data;
  } catch (error) {
      console.error("Ошибка при удалении:", error);
      throw error;
  }
}