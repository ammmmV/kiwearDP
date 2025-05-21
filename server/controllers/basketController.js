const ApiError = require('../error/ApiError');
const { Basket, BasketItem, Pattern, Fabric, Type } = require('../models/models');

class BasketController {
    async addToBasket(req, res, next) {
        try {
            const { patternId } = req.body
            const userId = req.user.id // Получаем ID текущего пользователя из JWT токена
            
            if (!patternId || isNaN(patternId)) {
                return next(ApiError.badRequest('Некорректный ID товара'));
            }
            
            // Находим или создаем корзину пользователя
            const [basket] = await Basket.findOrCreate({
                where: { userId }
            })
            
            // Проверяем существование товара
            const pattern = await Pattern.findByPk(patternId)
            if (!pattern) {
                return next(ApiError.badRequest('Товар не найден'))
            }

            // Добавляем товар в корзину
            const [basketItem, created] = await BasketItem.findOrCreate({
                where: { basketId: basket.id, patternId },
                defaults: { quantity: 1 }
            })

            // Если товар уже был в корзине, увеличиваем количество
            if (!created) {
                await basketItem.update({ quantity: basketItem.quantity + 1 })
            }

            return res.json({ basketItem, added: created });
        } catch (e) {
            return next(ApiError.internal('Ошибка на сервере при добавлении в корзину'));
        }
    }

    async getBasket(req, res, next) {
        try {
            const userId = req.user.id
            
            const basket = await Basket.findOne({
                where: { userId },
                include: [{
                    model: Pattern,
                    through: BasketItem
                }]
            })

            return res.json(basket ? basket.patterns : [])
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }


    async removeFromBasket(req, res, next) {
        try {
            const { patternId } = req.params
            const userId = req.user.id

            const basket = await Basket.findOne({ where: { userId } })
            if (!basket) {
                return next(ApiError.badRequest('Корзина не найдена'))
            }

            await BasketItem.destroy({
                where: { basketId: basket.id, patternId }
            })

            return res.json({ message: 'Товар удален из корзины' })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async updateQuantity(req, res, next) {
        try {
            const { id } = req.params;
            const { quantity } = req.body;
            const userId = req.user.id;

            const basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                return next(ApiError.badRequest('Корзина не найдена'));
            }

            const basketItem = await BasketItem.findOne({
                where: {
                    id,
                    basketId: basket.id
                }
            });

            if (!basketItem) {
                return next(ApiError.badRequest('Товар не найден в корзине'));
            }

            basketItem.quantity = quantity;
            await basketItem.save();

            return res.json(basketItem);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new BasketController();