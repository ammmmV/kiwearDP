import { $authHost, $host } from "./index";

export const createReview = async (review) => {
  const { data } = await $authHost.post('/api/review', review);
  return data;
};

export const fetchReviews = async () => {
  const { data } = await $authHost.get('/api/review');
  return data;
};

export const fetchUserReviews = async () => {
  const { data } = await $authHost.get('/api/review/user');
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
};

export const updateReviewStatus = async (id, status) => {
  try {
    const { data } = await $authHost.put(`api/review/admin/status/${id}`, { status });
    return data;
  } catch (error) {
    console.error("Ошибка при обновлении статуса отзыва:", error);
    throw error;
  }
};