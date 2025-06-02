const { FabricCalculator, Fabric } = require('../models/models');
const ApiError = require('../error/ApiError');
const { Op } = require('sequelize');

class FabricCalculatorController {
    async create(req, res, next) {
        try {
            const { clothing_type, fabricId, height_min, height_max, size_min, size_max, base_consumption, height_factor, size_factor } = req.body;
            
            if (!clothing_type || !fabricId || !height_min || !height_max || !size_min || !size_max || !base_consumption) {
                return next(ApiError.badRequest('Не все обязательные поля заполнены'));
            }

            const fabricCalculator = await FabricCalculator.create({
                clothing_type,
                fabricId,
                height_min,
                height_max,
                size_min,
                size_max,
                base_consumption,
                height_factor: height_factor || 0,
                size_factor: size_factor || 0
            });

            return res.json(fabricCalculator);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res) {
        try {
            const calculators = await FabricCalculator.findAll({
                include: [{ model: Fabric }]
            });
            return res.json(calculators);
        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: e.message });
        }
    }

    async getByClothingType(req, res) {
        try {
            const { clothing_type } = req.params;
            const calculators = await FabricCalculator.findAll({
                where: { clothing_type },
                include: [{ model: Fabric }]
            });
            return res.json(calculators);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    async getOne(req, res) {
        try {
            const { id } = req.params;
            const calculator = await FabricCalculator.findOne({
                where: { id },
                include: [{ model: Fabric }]
            });
            
            if (!calculator) {
                return res.status(404).json({ message: 'Запись не найдена' });
            }
            
            return res.json(calculator);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { clothing_type, fabricId, height_min, height_max, size_min, size_max, base_consumption, height_factor, size_factor } = req.body;
            
            const calculator = await FabricCalculator.findOne({ where: { id } });
            
            if (!calculator) {
                return next(ApiError.badRequest('Запись не найдена'));
            }
            
            await calculator.update({
                clothing_type: clothing_type || calculator.clothing_type,
                fabricId: fabricId || calculator.fabricId,
                height_min: height_min || calculator.height_min,
                height_max: height_max || calculator.height_max,
                size_min: size_min || calculator.size_min,
                size_max: size_max || calculator.size_max,
                base_consumption: base_consumption || calculator.base_consumption,
                height_factor: height_factor !== undefined ? height_factor : calculator.height_factor,
                size_factor: size_factor !== undefined ? size_factor : calculator.size_factor
            });
            
            return res.json(calculator);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const calculator = await FabricCalculator.findOne({ where: { id } });
            
            if (!calculator) {
                return next(ApiError.badRequest('Запись не найдена'));
            }
            
            await calculator.destroy();
            
            return res.json({ message: 'Запись успешно удалена' });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }


    // async calculate(req, res, next) {
    //     console.log('--- Fabric Calculation Started ---');
    //     try {
    //         const { clothing_type, fabricId, height, size, quantity } = req.body;
    //         console.log('Request Body:', req.body);

    //         if (!clothing_type || fabricId === undefined || height === undefined || size === undefined || quantity === undefined) {
    //             console.error('Validation Error: Missing fields.');
    //             return next(ApiError.badRequest('Не все обязательные поля заполнены (clothing_type, fabricId, height, size, quantity)'));
    //         }

    //         const numericHeight = parseFloat(height);
    //         const numericSize = parseFloat(size);
    //         const numericQuantity = parseInt(quantity, 10);

    //         if (isNaN(numericHeight) || isNaN(numericSize) || isNaN(numericQuantity)) {
    //             console.error('Validation Error: height, size, or quantity are not valid numbers.');
    //             return next(ApiError.badRequest('Height, size, или quantity должны быть числами.'));
    //         }
    //         console.log(`Parsed inputs - clothing_type: ${clothing_type}, fabricId: ${fabricId}, height: ${numericHeight}, size: ${numericSize}, quantity: ${numericQuantity}`);

    //         console.log('Attempting to find exact calculator entry...');
    //         const calculatorQuery = {
    //             where: {
    //                 clothing_type,
    //                 fabricId: parseInt(fabricId, 10),
    //                 height_min: { [Op.lte]: numericHeight },
    //                 height_max: { [Op.gte]: numericHeight },
    //                 size_min: { [Op.lte]: numericSize },
    //                 size_max: { [Op.gte]: numericSize }
    //             }
    //         };
    //         // console.log('Exact calculator query:', JSON.stringify(calculatorQuery, null, 2)); // Можно оставить для детального лога
    //         const calculator = await FabricCalculator.findOne(calculatorQuery);

    //         let finalConsumption;

    //         if (calculator) {
    //             console.log('Exact calculator entry found:', JSON.stringify(calculator.toJSON(), null, 2));
                
    //             const baseConsumption = parseFloat(calculator.base_consumption);
    //             const heightFactor = parseFloat(calculator.height_factor);
    //             const sizeFactor = parseFloat(calculator.size_factor);
    //             const calcHeightMin = calculator.height_min; // Уже число из БД (INTEGER)
    //             const calcSizeMin = calculator.size_min;   // Уже число из БД (INTEGER)

    //             if (isNaN(baseConsumption) || isNaN(heightFactor) || isNaN(sizeFactor)) {
    //                 console.error('Error: Calculator data is not valid for calculation.', { baseConsumption, heightFactor, sizeFactor });
    //                 return next(ApiError.internal('Ошибка в данных калькулятора (base_consumption, height_factor, or size_factor).'));
    //             }
    //             console.log('Calculator numeric values:', { baseConsumption, heightFactor, sizeFactor, calcHeightMin, calcSizeMin });

    //             const heightDiff = numericHeight - calcHeightMin;
    //             const sizeDiff = numericSize - calcSizeMin;
    //             console.log(`Differences for exact match - heightDiff: ${numericHeight} - ${calcHeightMin} = ${heightDiff}, sizeDiff: ${numericSize} - ${calcSizeMin} = ${sizeDiff}`);

    //             const consumptionBeforeQuantity = baseConsumption +
    //                                              (heightDiff * heightFactor) +
    //                                              (sizeDiff * sizeFactor);
    //             console.log(`Consumption components for exact match: ${baseConsumption} (base) + (${heightDiff} * ${heightFactor}) (height_adj) + (${sizeDiff} * ${sizeFactor}) (size_adj) = ${consumptionBeforeQuantity}`);
                
    //             finalConsumption = consumptionBeforeQuantity * numericQuantity;
    //             console.log(`Calculation with exact match (factors applied): (${consumptionBeforeQuantity}) * ${numericQuantity} (qty) = ${finalConsumption}`);

    //         } else {
    //             // Логика, если ТОЧНЫЙ диапазон не найден, ищем "калькулятор по умолчанию"
    //             // для данного типа одежды и ткани, и применяем его факторы.
    //             // Эта часть остается как есть, она будет срабатывать, если ни один диапазон не покрыл входные данные.
    //             console.log('No exact range calculator entry found. Attempting fallback to default calculator for clothing_type and fabricId.');
                
    //             const defaultCalculatorQuery = {
    //                 where: {
    //                     clothing_type,
    //                     fabricId: parseInt(fabricId, 10)
    //                 }
    //             };
    //             // console.log('Default calculator query:', JSON.stringify(defaultCalculatorQuery, null, 2));
    //             const defaultCalculator = await FabricCalculator.findOne(defaultCalculatorQuery);

    //             if (!defaultCalculator) {
    //                 console.log('No default calculator found for clothing_type and fabricId.');
    //                 return res.status(404).json({ message: 'Нет данных для расчета (калькулятор не найден).' });
    //             }
    //             console.log('Default calculator entry found:', JSON.stringify(defaultCalculator.toJSON(), null, 2));

    //             const baseConsumption = parseFloat(defaultCalculator.base_consumption);
    //             const heightFactor = parseFloat(defaultCalculator.height_factor);
    //             const sizeFactor = parseFloat(defaultCalculator.size_factor);
    //             const calcHeightMin = defaultCalculator.height_min;
    //             const calcSizeMin = defaultCalculator.size_min;

    //             if (isNaN(baseConsumption) || isNaN(heightFactor) || isNaN(sizeFactor)) {
    //                 console.error('Error: defaultCalculator data is not valid for calculation.', {baseConsumption, heightFactor, sizeFactor});
    //                 return next(ApiError.internal('Ошибка в данных калькулятора по умолчанию.'));
    //             }
    //             console.log('Default calculator numeric values:', { baseConsumption, heightFactor, sizeFactor, calcHeightMin, calcSizeMin });
                
    //             const heightDiff = numericHeight - calcHeightMin;
    //             const sizeDiff = numericSize - calcSizeMin;
    //             console.log(`Differences for fallback - heightDiff: ${numericHeight} - ${calcHeightMin} = ${heightDiff}, sizeDiff: ${numericSize} - ${calcSizeMin} = ${sizeDiff}`);

    //             const consumptionBeforeQuantity = baseConsumption +
    //                                              (heightDiff * heightFactor) +
    //                                              (sizeDiff * sizeFactor);
    //             console.log(`Consumption components for fallback: ${baseConsumption} (base) + (${heightDiff} * ${heightFactor}) (height_adj) + (${sizeDiff} * ${sizeFactor}) (size_adj) = ${consumptionBeforeQuantity}`);
                
    //             finalConsumption = consumptionBeforeQuantity * numericQuantity;
    //             console.log(`Fallback calculation: (${consumptionBeforeQuantity}) * ${numericQuantity} (qty) = ${finalConsumption}`);
    //         }
            
    //         if (isNaN(finalConsumption)) {
    //             console.error('Error: Final consumption resulted in NaN. Check calculation logic and input data types.');
    //             return next(ApiError.internal('Ошибка расчета, результат не является числом.'));
    //         }

    //         // Округление до двух знаков после запятой, значение не может быть отрицательным
    //         const roundedConsumption = (Math.max(0, finalConsumption)).toFixed(2); // .toFixed(2) возвращает строку
    //         console.log(`Final consumption: ${finalConsumption}, Rounded to string: ${roundedConsumption}`);
            
    //         return res.json({
    //             // consumption: parseFloat(roundedConsumption) // Если нужен Number в JSON
    //             consumption: roundedConsumption // Если строка "X.XX" подходит
    //         });

    //     } catch (e) {
    //         console.error('--- Fabric Calculation Error ---');
    //         console.error('Error caught in calculate method:', e);
    //         next(ApiError.internal(`Внутренняя ошибка сервера: ${e.message}`));
    //     }
    // }

    async calculate(req, res, next) {
        try {
            const { clothing_type, fabricId, height, size, quantity } = req.body;
    
            if (!clothing_type || !fabricId || !height || !size || !quantity) {
                return next(ApiError.badRequest('Не все обязательные поля заполнены'));
            }
    
            const calculator = await FabricCalculator.findOne({
                where: {
                    clothing_type,
                    fabricId
                }
            });
    
            if (!calculator) {
                return res.status(404).json({ message: 'Калькулятор для заданного типа одежды и ткани не найден' });
            }
    
            const h = Math.max(calculator.height_min, Math.min(height, calculator.height_max));
            const s = Math.max(calculator.size_min, Math.min(size, calculator.size_max));
            const q = quantity;
    
            const consumption =
                (parseFloat(calculator.base_consumption) +
                    (h - calculator.height_min) * parseFloat(calculator.height_factor) +
                    (s - calculator.size_min) * parseFloat(calculator.size_factor)) * q;
    
            return res.json({
                consumption: consumption.toFixed(2)
            });
    
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    };
}

module.exports = new FabricCalculatorController();