const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Basket, BasketItem } = require('../models/models')

const generateJwt = (id, email, role, name, phone, basketCount = 0) => {
    return jwt.sign(
        { id, email, role, name, phone, basketCount },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    )
}

class UserController {

    constructor() {
        // Привязываем каждый метод к экземпляру класса
        // Это гарантирует, что 'this' внутри этих методов будет ссылаться на UserControler
        this.registration = this.registration.bind(this);
        this.login = this.login.bind(this);
        this.check = this.check.bind(this);
        this.getHeaderData = this.getHeaderData.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.getCurrentUser = this.getCurrentUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.updateRole = this.updateRole.bind(this);
        this.updateUser = this.updateUser.bind(this);
        // _getBasketItemCount не привязываем, так как она вызывается через 'this.'
        // Если бы она была статической, то bind был бы не нужен.
        // Если она не статическая, то this._getBasketItemCount() будет работать,
        // потому что методы, вызывающие ее (например, getHeaderData), уже привязаны.
    }

    async _getBasketItemCount(userId) {
        if (!userId) {
            return 0;
        }
        const basket = await Basket.findOne({
            where: { userId },
            include: [{
                model: BasketItem,
                attributes: ['quantity']
            }]
        });

        if (basket && basket.basket_items) {
            return basket.basket_items.reduce((total, item) => total + item.quantity, 0);
        }
        return 0;
    }

    async registration(req, res, next) {
        try {
            const { email, password, name, phone, role } = req.body
            if (!email || !password || !name || !phone) {
                return next(ApiError.badRequest('Некорректные данные'))
            }
            const candidate = await User.findOne({ where: { email } })
            if (candidate) {
                return next(ApiError.badRequest('Пользователь с таким email уже существует'))
            }
            const hashPassword = await bcrypt.hash(password, 5)
            const user = await User.create({
                email,
                name,
                phone,
                role,
                password: hashPassword
            })

            await Basket.create({ userId: user.id });

            const basketCount = await this._getBasketItemCount(user.id);

            const token = generateJwt(user.id, user.email, user.role, user.name, user.phone, basketCount); 
            return res.json({ token })
        } catch (error) {
            return next(ApiError.internal('Ошибка при регистрации пользователя'))
        }
    }

    async login(req, res, next) {
        const { email, password } = req.body
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        const basketCount = await this._getBasketItemCount(user.id);

        const token = generateJwt(user.id, user.email, user.role, user.name, user.phone, basketCount);  
        return res.json({ token })
    }

    async getUsers(req, res, next) {
        try {
            const users = await User.findAll();

            return res.json(users);
        } catch (error) {
            next(ApiError.internal('Произошла ошибка при получении пользователей'));
        }
    }

    async getCurrentUser(req, res, next) {
        try {
            const { id } = req.user;
            const user = await User.findOne({ where: { id } });
    
            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'));
            }
    
            return res.json(user);
        } catch (error) {
            next(ApiError.internal('Ошибка при получении пользователя'));
        }
    }    

    async check(req, res, next) {
        // const basketCount = await this._getBasketItemCount(req.user.id);

        const token = generateJwt(
            req.user.id,
            req.user.email,
            req.user.role,
            req.user.name,
            req.user.phone,
            // basketCount
        );
        return res.json({ token })
    }

    async updateRole(req, res) {
        const { id } = req.params;
        const { role } = req.body;
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            user.role = role;
            await user.save();
            return res.json({ message: 'Роль обновлена', user });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }
            await user.destroy();
            return res.status(200).json({ message: 'Пользователь успешно удалён' });
        } catch (error) {
            console.error("Ошибка при удалении пользователя:", error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    };

    async updateUser(req, res, next) {
        try {
            const { id, email, name, phone, size } = req.body;
            
            const user = await User.findOne({ where: { id } });
            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'));
            }
    
            user.email = email;
            user.name = name;
            user.phone = phone;
            user.size = size;
    
            await user.save();
    
            const token = generateJwt(user.id, user.email, user.role, user.name, user.phone);
            
            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    name: user.name,
                    phone: user.phone,
                    size: user.size
                }
            });
        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении данных пользователя'));
        }
    }

    async getHeaderData(req, res, next) {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);

            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'));
            }

            const basketCount = await this._getBasketItemCount(userId);

            return res.json({
                name: user.name,
                basketCount: basketCount
            });
        } catch (e) {
            console.error("Error fetching header data:", e);
            return next(ApiError.internal('Ошибка при получении данных для шапки: ' + e.message));
        }
    }
}

module.exports = new UserController()