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
        attributes: ['id', 'rating', 'comment', 'date', 'status'],
        include: [
          { 
            model: Pattern,
            attributes: ['id', 'name']
          },
          { 
            model: User,
            attributes: ['id', 'email']
          }
        ],
        where: { status: 'APPROVED' } 
      });
      return res.json(reviews);
    } catch (e) {
      console.error("Ошибка при получении отзывов:", e);
      res
        .status(500)
        .json({ message: "Ошибка при получении отзывов", error: e.message });
    }
  }

  async getAllForAdmin(req, res) {
    try {
      const { search, rating, status } = req.query;
      
      // Базовые условия поиска
      const whereConditions = {};
      
      // Добавление фильтра по статусу, если указан
      if (status) {
        whereConditions.status = status;
      }
      
      // Добавление фильтра по рейтингу, если указан
      if (rating) {
        whereConditions.rating = parseInt(rating);
      }
      
      const reviews = await Review.findAll({
        attributes: ['id', 'rating', 'comment', 'date', 'status'],
        where: whereConditions,
        include: [
          { 
            model: Pattern,
            attributes: ['id', 'name'],
            // Поиск по названию товара, если указан поисковый запрос
            ...(search && {
              where: {
                name: {
                  [Op.like]: `%${search}%`
                }
              }
            })
          },
          { 
            model: User,
            attributes: ['id', 'email']
          }
        ],
        // Поиск по комментарию, если указан поисковый запрос
        ...(search && {
          where: {
            ...whereConditions,
            comment: {
              [Op.like]: `%${search}%`
            }
          }
        })
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
        attributes: ['id', 'rating', 'comment', 'date', 'status'],
        include: [
          { 
            model: Pattern,
            attributes: ['id', 'name']
          }
        ]
      });
      console.log("Отправляем отзывы пользователя:", JSON.stringify(reviews));
      return res.json(reviews);
    } catch (e) {
      console.error("Ошибка при получении отзывов пользователя:", e);
      res
        .status(500)
        .json({ message: "Ошибка при получении отзывов", error: e.message });
    }
  }


  async updateReviewStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
        return res.status(400).json({ message: "Недопустимый статус отзыва" });
      }
      
      const review = await Review.findByPk(id);
      if (!review) {
        return res.status(404).json({ message: "Отзыв не найден" });
      }
      
      review.status = status;
      await review.save();
      
      return res.json(review);
    } catch (error) {
      console.error("Ошибка при обновлении статуса отзыва:", error);
      return res.status(500).json({ message: "Ошибка сервера", error: error.message });
    }
  }

  async getPatternReviews(req, res) {
    try {
      const { patternId } = req.params;
      const reviews = await Review.findAll({
        where: { 
          patternId: patternId,
          status: 'APPROVED' // Только одобренные отзывы
        },
        attributes: ['id', 'rating', 'comment', 'date'],
        include: [
          { 
            model: User,
            attributes: ['id', 'name']
          }
        ],
        order: [['date', 'DESC']] // Сортировка по дате (новые сначала)
      });
      return res.json(reviews);
    } catch (e) {
      console.error("Ошибка при получении отзывов для паттерна:", e);
      res.status(500).json({ message: "Ошибка при получении отзывов", error: e.message });
    }
  }
}

module.exports = new ReviewController();
