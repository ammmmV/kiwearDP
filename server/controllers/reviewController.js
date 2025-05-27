const { Review, Order, OrderItem } = require('../models/models');

class ReviewController {
  async create(req, res) {
    try {
      const { patternId, rating, comment } = req.body;
const userId = req.user.id;

console.log('Ищем OrderItem для patternId:', patternId);
console.log('Пользователь userId:', userId);

const testItems = await OrderItem.findAll({
  where: { patternId: patternId },
  include: [Order]
});
console.log('Все найденные OrderItem:', JSON.stringify(testItems, null, 2));

const orderItem = await OrderItem.findOne({
  where: { patternId: patternId },
  include: [{
    model: Order,
    where: { 
        user_id: userId,
        status: 'COMPLETED'
    },
    required: true
  }]
});

if (!orderItem) {
  console.log("❗ OrderItem не найден или нет подходящего заказа");
  return res.status(403).json({ message: 'Вы можете оставить отзыв только на купленные товары.' });
}


      const review = await Review.create({
        orderItemId: orderItem.id,
        patternId,
        rating,
        comment,
        userId
      });
      console.log("Создаём отзыв с данными:", {
        orderItemId: orderItem.id,
        patternId,
        rating,
        comment,
        userId
      });
            
      return res.json(review);
    } catch (e) {
      console.error('❌ Ошибка при создании отзыва:', e);
      return res.status(500).json({
        message: 'Ошибка при создании отзыва на стороне сервера',
        error: e.message
      });
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