const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: "USER" },
})


const Basket = sequelize.define('basket', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

const BasketItem = sequelize.define('basket_item', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
    patternId: { type: DataTypes.INTEGER, allowNull: false },
});

// const BasketPattern = sequelize.define('basket_pattern', {
//     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
// })

const Pattern = sequelize.define('pattern', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    price: { type: DataTypes.DECIMAL, allowNull: false },
    img: { type: DataTypes.STRING, allowNull: false },
    description: {type: DataTypes.TEXT},
})

const Type = sequelize.define('type', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
})

const Fabric = sequelize.define('fabric', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
})

// Заказ
const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    order_number: {type: DataTypes.STRING, unique: true},
    status: {type: DataTypes.STRING, defaultValue: 'PENDING'},
    total_price: {type: DataTypes.DECIMAL},
    delivery_address: {type: DataTypes.STRING},
    payment_status: {type: DataTypes.STRING, defaultValue: 'UNPAID'},
    order_date: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    delivery_method: {type: DataTypes.STRING}, 
    cardNumber: {type: DataTypes.STRING}, 
    cardOwner: {type: DataTypes.STRING},
    notes: {type: DataTypes.TEXT}, 
})

// Отзыв
const Review = sequelize.define('review', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    rating: {type: DataTypes.INTEGER},
    comment: {type: DataTypes.TEXT},
    date: {type: DataTypes.DATE, defaultValue: DataTypes.NOW}
})

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(Review);
Review.belongsTo(User);

Pattern.hasMany(Review);
Review.belongsTo(Pattern);

// Fabric.hasMany(Review)
// Review.belongsTo(Fabric)

// Type.hasMany(Review)
// Review.belongsTo(Type)

User.hasOne(Basket)
Basket.belongsTo(User)

// Связи товаров с корзиной
Basket.belongsToMany(Pattern, { through: 'BasketPattern' });
Pattern.belongsToMany(Basket, { through: 'BasketPattern' });

// Basket.belongsToMany(Fabric, { through: 'BasketFabric' });
// Fabric.belongsToMany(Basket, { through: 'BasketFabric' });

// Basket.belongsToMany(Type, { through: 'BasketType' });
// Type.belongsToMany(Basket, { through: 'BasketType' });

// Связь заказа с товарами через промежуточные таблицы
Order.belongsToMany(Pattern, {through: 'OrderPattern'})
Pattern.belongsToMany(Order, {through: 'OrderPattern'})

// Order.belongsToMany(Fabric, {through: 'OrderFabric'})
// Fabric.belongsToMany(Order, {through: 'OrderFabric'})

// Order.belongsToMany(Type, {through: 'OrderAccessory'})
// Type.belongsToMany(Order, {through: 'OrderAccessory'})

// Связи между лекалами, тканями и фурнитурой
Fabric.hasMany(Pattern)
Pattern.belongsTo(Fabric)

Type.hasMany(Pattern)
Pattern.belongsTo(Type)

module.exports = {
    User,
    Pattern,
    Fabric,
    Type,
    Order,
    Review,
    Basket,
    BasketItem
}