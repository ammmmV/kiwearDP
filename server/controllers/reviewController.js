const { Review, Order, OrderItem } = require('../models/models');

class ReviewController {
  async create(req, res) {
    try {
      const { patternId, rating, comment } = req.body;
      const userId = req.user.id;
      
      // Проверяем, заказывал ли пользователь этот товар
      const orderItem = await OrderItem.findOne({
        where: { patternId },
        include: [{
          model: Order,
          where: { user_id: userId },
          required: true
        }]
      });

      if (!orderItem) {
        return res.status(403).json({ message: 'Вы можете оставить отзыв только на купленные товары.' });
      }

      const review = await Review.create({ patternId, rating, comment, userId });
      return res.json(review);
    } catch (e) {
      console.error('Error creating review:', e);
      res.status(500).json({ message: 'Ошибка при создании отзыва', error: e.message });
    }
  }
  async getAll(req, res) {
    try {
      const reviews = await Review.findAll();
      return res.json(reviews);
    } catch (e) {
      res.status(500).json({ message: 'Ошибка при получении отзывов', error: e.message });
    }
  }
}

module.exports = new ReviewController();