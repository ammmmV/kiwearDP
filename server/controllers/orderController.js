const ApiError = require('../error/ApiError');
const { Order, Pattern } = require('../models/models');
const uuid = require('uuid');

class OrderController {
    async create(req, res, next) {
        try {
            const {
                shipping_address,
                delivery_method,
                contact_phone,
                notes,
                patterns
            } = req.body;

            if (!req.user || !req.user.id) {
                return next(ApiError.unauthorized('Пользователь не авторизован'));
            }

            if (!patterns?.length) {
                return next(ApiError.badRequest('Заказ не может быть пустым'));
            }

            const total_price = patterns.reduce((sum, item) => {
                if (!item.price || !item.quantity || item.price < 0 || item.quantity < 1) {
                    throw new Error('Некорректные данные товара');
                }
                return sum + (item.price * item.quantity);
            }, 0);

            if (!delivery_method) {
                return next(ApiError.badRequest('Не указан метод доставки'));
            }

            if (delivery_method === 'courier' && !shipping_address) {
                return next(ApiError.badRequest('Не указан адрес доставки'));
            }

            const order = await Order.create({
                order_number: uuid.v4(),
                status: 'PENDING',
                total_price,
                shipping_address,
                contact_phone,
                payment_status: 'UNPAID',
                delivery_method,
                notes,
                user_id: req.user.id
            });

            // Добавляем только паттерны к заказу
            for (let pattern of patterns) {
                const existingPattern = await Pattern.findByPk(pattern.id);
                if (!existingPattern) {
                    throw new Error(`Товар с ID ${pattern.id} не найден`);
                }
                await order.addPattern(pattern.id, { 
                    through: { quantity: pattern.quantity }
                });
            }

            const fullOrder = await Order.findOne({
                where: { id: order.id },
                include: [
                    { 
                        model: Pattern,
                        through: { attributes: ['quantity'] }
                    }
                ]
            });

            return res.json(fullOrder);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const orders = await Order.findAll({
                where: { user_id: req.user.id },
                include: [
                    { 
                        model: Pattern,
                        through: { attributes: ['quantity'] }
                    }
                ],
                order: [['created_at', 'DESC']]
            });
            return res.json(orders);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const order = await Order.findOne({
                where: { id },
                include: [
                    { 
                        model: Pattern,
                        through: { attributes: ['quantity'] }
                    }
                ]
            });
            
            if (!order) {
                return next(ApiError.badRequest('Заказ не найден'));
            }
            
            return res.json(order);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async updateStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            
            const order = await Order.findOne({ where: { id } });
            
            if (!order) {
                return next(ApiError.badRequest('Заказ не найден'));
            }
            
            order.status = status;
            await order.save();
            
            return res.json(order);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new OrderController();