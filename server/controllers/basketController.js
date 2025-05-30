const ApiError = require("../error/ApiError");
const { Basket, BasketItem, Pattern } = require("../models/models");

class BasketController {
  async addToBasket(req, res, next) {
    try {
      const { patternId } = req.body;
      const userId = req.user.id;
    
      console.log('Получены данные:', { patternId, userId });
    
      if (!userId) {
        return next(ApiError.badRequest("Пользователь не авторизован"));
      }

      if (!patternId || isNaN(patternId)) {
        return next(ApiError.badRequest("Некорректный ID товара"));
      }

      const pattern = await Pattern.findByPk(patternId);
      if (!pattern) {
        return next(ApiError.badRequest("Товар не найден"));
      }

      const [basket] = await Basket.findOrCreate({
        where: { userId }
      });

      const [basketItem, created] = await BasketItem.findOrCreate({
        where: { basketId: basket.id, patternId },
        defaults: { quantity: 1 }
      });

      if (!created) {
        await basketItem.update({
          quantity: basketItem.quantity + 1
        });
      }

      console.log('Создан basketItem:', basketItem);
    
      const updatedBasketItem = await BasketItem.findOne({
        where: { id: basketItem.id },
        include: [{
          model: Pattern,
          attributes: ['id', 'name', 'price', 'img']
        }]
      });
    
      console.log('Получен updatedBasketItem:', updatedBasketItem);
    
      return res.json(updatedBasketItem);
    } catch (e) {
      console.error('Полная ошибка:', e);
      return next(ApiError.internal('Ошибка при добавлении товара в корзину: ' + e.message));
    }
  }

  async getBasket(req, res, next) {
    try {
      const userId = req.user.id;

      const basket = await Basket.findOne({
        where: { userId },
        include: [{
          model: BasketItem,
          include: [{
            model: Pattern,
            attributes: ['id', 'name', 'price', 'img']
          }]
        }]
      });

      const basketItems = basket ? basket.basket_items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        patternId: item.patternId,
        pattern: item.pattern
      })) : [];

      return res.json(basketItems);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async removeFromBasket(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const basket = await Basket.findOne({ where: { userId } });
      if (!basket) {
        return next(ApiError.badRequest("Корзина не найдена"));
      }

      await BasketItem.destroy({
        where: { basketId: basket.id, id },
      });

      return res.json({ message: "Товар удален из корзины" });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async updateQuantity(req, res, next) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const userId = req.user.id;

      const basket = await Basket.findOne({ where: { userId } });
      if (!basket) {
        return next(ApiError.badRequest("Корзина не найдена"));
      }

      const basketItem = await BasketItem.findOne({
        where: {
          id,
          basketId: basket.id,
        },
        include: [{
          model: Pattern,
          attributes: ['id', 'name', 'price', 'img']
        }]
      });

      if (!basketItem) {
        return next(ApiError.badRequest("Товар не найден в корзине"));
      }

      basketItem.quantity = quantity;
      await basketItem.save();

      return res.json(basketItem);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async clearBasket(req, res, next) {
      try {
          const userId = req.user.id;
  
          const basket = await Basket.findOne({ where: { userId } });
          if (!basket) {
              return next(ApiError.badRequest("Корзина не найдена"));
          }
  
          await BasketItem.destroy({
              where: { basketId: basket.id }
          });
  
          return res.json({ message: "Корзина успешно очищена" });
      } catch (e) {
          next(ApiError.badRequest(e.message));
      }
  }
}

module.exports = new BasketController();
