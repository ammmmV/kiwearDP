const { Review, Order, OrderItem, User, Pattern } = require("../models/models");

class ReviewController {
  async create(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Пользователь не авторизован" });
      }

      const { patternId, rating, comment } = req.body;
      const userId = req.user.id;

      console.log("Ищем OrderItem для patternId:", patternId);
      console.log("Пользователь userId:", userId);

      const testItems = await OrderItem.findAll({
        where: { patternId: patternId },
        include: [Order],
      });
      console.log(
        "Все найденные OrderItem:",
        JSON.stringify(testItems, null, 2)
      );

      const orderItem = await OrderItem.findOne({
        where: { patternId: patternId },
        include: [
          {
            model: Order,
            where: {
              user_id: userId,
              status: "COMPLETED",
            },
            required: true,
          },
        ],
      });
      console.log(orderItem);
      if (!orderItem) {
        console.log("❗ OrderItem не найден или нет подходящего заказа");
        return res
          .status(403)
          .json({
            message: "Вы можете оставить отзыв только на купленные товары.",
          });
      }

      const review = await Review.create({
        orderItemId: orderItem.id,
        patternId,
        rating,
        comment,
        userId,
      });
      console.log("Создаём отзыв с данными:", {
        orderItemId: orderItem.id,
        patternId,
        rating,
        comment,
        userId,
      });

      return res.json(review);
    } catch (e) {
      console.error("❌ Ошибка при создании отзыва:", e);
      return res.status(500).json({
        message: "Ошибка при создании отзыва на стороне сервера",
        error: e.message,
      });
    }
  }
  async getAll(req, res) {
    try {
      const reviews = await Review.findAll({
        attributes: ['id', 'rating', 'comment', 'date'],
        include: [
          { 
            model: Pattern,
            attributes: ['id', 'name']
          },
          { 
            model: User,
            attributes: ['id', 'email']
          }
        ]
      });
      return res.json(reviews);
    } catch (e) {
      console.error("Ошибка при получении отзывов:", e);
      res
        .status(500)
        .json({ message: "Ошибка при получении отзывов", error: e.message });
    }
  }

  async deleteReview(req, res) {
    try {
      const { id } = req.params;
      const review = await Review.findByPk(id);
      if (!review) {
        return res.status(404).json({ message: 'Отзыв не найден' });
      }
      await review.destroy();
      return res.status(200).json({ message: 'Отзыв успешно удалён' });
    } catch (error) {
      console.error("Ошибка при удалении отзыва:", error);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }
  };

  async getUserReviews(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Пользователь не авторизован" });
      }
      
      const userId = req.user.id;
      const reviews = await Review.findAll({
        where: { userId: userId },
        attributes: ['id', 'rating', 'comment', 'date'],
        include: [
          { 
            model: Pattern,
            attributes: ['id', 'name']
          }
        ]
      });
      return res.json(reviews);
    } catch (e) {
      console.error("Ошибка при получении отзывов пользователя:", e);
      res
        .status(500)
        .json({ message: "Ошибка при получении отзывов", error: e.message });
    }
  }
}

module.exports = new ReviewController();
