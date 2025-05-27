const sequelize = require('../db');
const { DataTypes } = require('sequelize');

// Пользователь
const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: "USER" },
});

// Корзина
const Basket = sequelize.define('basket', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

// Элемент корзины
const BasketItem = sequelize.define('basket_item', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
    basketId: { type: DataTypes.INTEGER, allowNull: false },
    patternId: { type: DataTypes.INTEGER, allowNull: false }
});

// Шаблон/товар
const Pattern = sequelize.define('pattern', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    price: { type: DataTypes.DECIMAL, allowNull: false },
    img: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
});

// Тип
const Type = sequelize.define('type', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

// Ткань
const Fabric = sequelize.define('fabric', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
});

// Заказ
const Order = sequelize.define('order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    order_number: { type: DataTypes.STRING, unique: true },
    status: { type: DataTypes.STRING, defaultValue: 'PENDING' },
    total_price: { type: DataTypes.DECIMAL },
    delivery_address: { type: DataTypes.STRING },
    payment_status: { type: DataTypes.STRING, defaultValue: 'UNPAID' },
    order_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    delivery_method: { type: DataTypes.STRING },
    cardNumber: { type: DataTypes.STRING },
    cardOwner: { type: DataTypes.STRING },
    notes: { type: DataTypes.TEXT },
});

// Элемент заказа (связующая таблица)
const OrderItem = sequelize.define('order_item', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
});

// Отзыв
const Review = sequelize.define('review', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    patternId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: false },
});

// ---------------------- СВЯЗИ ----------------------

// User
User.hasOne(Basket);
Basket.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Review);
Review.belongsTo(User);

// Pattern
Pattern.hasMany(Review);
Review.belongsTo(Pattern);

Pattern.belongsTo(Fabric);
Fabric.hasMany(Pattern);

Pattern.belongsTo(Type);
Type.hasMany(Pattern);

// Basket & BasketItem
Basket.hasMany(BasketItem);
BasketItem.belongsTo(Basket);

BasketItem.belongsTo(Pattern);

// Order & OrderItem (many-to-many через OrderItem)
Order.belongsToMany(Pattern, { through: OrderItem });
Pattern.belongsToMany(Order, { through: OrderItem });

// ---------------------- ЭКСПОРТ ----------------------
module.exports = {
    User,
    Pattern,
    Fabric,
    Type,
    Order,
    OrderItem,
    Review,
    Basket,
    BasketItem
};
