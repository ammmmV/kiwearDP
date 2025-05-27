const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: "USER" },
});

const Basket = sequelize.define('basket', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BasketItem = sequelize.define('basket_item', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
    basketId: { type: DataTypes.INTEGER, allowNull: false },
    patternId: { type: DataTypes.INTEGER, allowNull: false }
});

const Pattern = sequelize.define('pattern', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    price: { type: DataTypes.DECIMAL, allowNull: false },
    img: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
});

const Type = sequelize.define('type', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const Fabric = sequelize.define('fabric', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
});

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

const OrderItem = sequelize.define('order_item', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    orderId: { type: DataTypes.INTEGER, allowNull: false },
    patternId: { type: DataTypes.INTEGER, allowNull: false }
  });
  

  const Review = sequelize.define('review', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    orderItemId: { type: DataTypes.INTEGER, allowNull: false },
    patternId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: false }
  });
  

OrderItem.hasOne(Review);
Review.belongsTo(OrderItem);

User.hasOne(Basket);
Basket.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Review);
Review.belongsTo(User);

Pattern.hasMany(Review);
Review.belongsTo(Pattern);

Pattern.belongsTo(Fabric);
Fabric.hasMany(Pattern);

Pattern.belongsTo(Type);
Type.hasMany(Pattern);

Basket.hasMany(BasketItem);
BasketItem.belongsTo(Basket);

BasketItem.belongsTo(Pattern);

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

Pattern.hasMany(OrderItem);
OrderItem.belongsTo(Pattern);

Order.belongsToMany(Pattern, { through: OrderItem });
Pattern.belongsToMany(Order, { through: OrderItem });

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
