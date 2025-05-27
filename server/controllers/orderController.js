const ApiError = require('../error/ApiError');
const { Order, Pattern, OrderItem } = require('../models/models');
const uuid = require('uuid');

class OrderController {
    async create(req, res, next) {
        try {
            const {
                delivery_address,
                delivery_method,
                contact_phone,
                cardNumber,
                cardOwner,
                notes,
                patterns
            } = req.body;

            if (!req.user || !req.user.id) {
                return next(ApiError.unauthorized('Пользователь не авторизован'));
            }

            if (!Array.isArray(patterns) || patterns.length === 0) {
                return next(ApiError.badRequest('Заказ не может быть пустым'));
            }

            const total_price = patterns.reduce((sum, item) => {
                if (!item.price || !item.quantity || item.price < 0 || item.quantity < 1) {
                    throw new Error('Некорректные данные товара');
                }
                return sum + item.price * item.quantity;
            }, 0);

            if (!delivery_method) {
                return next(ApiError.badRequest('Не указан метод доставки'));
            }

            if (delivery_method === 'courier' && !delivery_address) {
                return next(ApiError.badRequest('Не указан адрес доставки'));
            }

            const order = await Order.create({
                order_number: uuid.v4(),
                status: 'PENDING',
                total_price,
                delivery_address,
                contact_phone,
                payment_status: 'UNPAID',
                delivery_method,
                cardNumber,
                cardOwner,
                notes,
                user_id: req.user.id
            });

            for (const pattern of patterns) {
                const existingPattern = await Pattern.findByPk(pattern.id);
                if (!existingPattern) {
                    throw new Error(`Товар с ID ${pattern.id} не найден`);
                }

                await OrderItem.create({
                    orderId: order.id,
                    patternId: pattern.id,
                    quantity: pattern.quantity
                });
            }

            const fullOrder = await Order.findOne({
                where: { id: order.id },
                include: [
                    {
                        model: Pattern,
                        through: {
                            model: OrderItem,
                            attributes: ['quantity']
                        }
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
            if (!req.user || !req.user.id) {
                return next(ApiError.unauthorized('Пользователь не авторизован'));
            }

            const orders = await Order.findAll({
                where: { user_id: req.user.id },
                include: [
                    {
                        model: Pattern,
                        through: {
                            model: OrderItem,
                            attributes: ['quantity']
                        }
                    }
                ],
                order: [['createdAt', 'DESC']]
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
                        through: {
                            model: OrderItem,
                            attributes: ['quantity']
                        }
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
