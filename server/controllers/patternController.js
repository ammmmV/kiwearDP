const uuid = require('uuid')
const path = require('path')
const { Pattern } = require('../models/models')
const ApiError = require('../error/ApiError');

class PatternController {
    async create(req, res, next){
        try {

            let {name, price, fabricId, typeId, description} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const pattern = await Pattern.create({name, price, fabricId, typeId, img: fileName, description});
            
            return res.json(pattern)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res){
        let {typeId, fabricId, limit, page} = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        let patterns;
        
        if (typeId && fabricId) {
            patterns = await Pattern.findAndCountAll({
                where: { typeId, fabricId },
                limit,
                offset
            })
        } else if (typeId) {
            patterns = await Pattern.findAndCountAll({
                where: { typeId },
                limit,
                offset
            })
        } else if (fabricId) {
            patterns = await Pattern.findAndCountAll({
                where: { fabricId },
                limit,
                offset
            })
        } else {
            patterns = await Pattern.findAndCountAll({limit, offset})
        }
        return res.json(patterns)
    }

    async getOne(req, res){
        const {id} = req.pragmas
        const pattern = await Pattern.findOne(
        {
            where: {id},
            include: [{model: PatternInfo, as: 'info'}]
        }
    )
    return res.json(pattern)
    }

    async updatePattern(req, res) {
        const { id } = req.params;
        const { name, price, img, description } = req.body; 
        
        try {
            if (isNaN(id)) {
                return res.status(400).json({ message: 'Некорректный ID' });
            }
    
            const pattern = await Pattern.findByPk(id);
            if (!pattern) {
                return res.status(404).json({ message: 'Паттерн не найден' });
            }
    
            if (name !== undefined) pattern.name = name;
            if (price !== undefined) pattern.price = price;
            if (description !== undefined) pattern.description = description;
            if (img !== undefined) pattern.img = img;
    
            await pattern.save();
    
            return res.json({ message: 'Обновление выполнено успешно', pattern });
        } catch (error) {
            console.error('Ошибка при обновлении паттерна:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async getPatterns(req, res, next) {
        try {
            const patterns = await Pattern.findAll();

            return res.json(patterns);
        } catch (error) {
            next(ApiError.internal('Произошла ошибка при получении паттернов'));
        }
    }

    async deletePattern(req, res) {
        try {
            const { id } = req.params;
            const pattern = await Pattern.findByPk(id);
            if (!pattern) {
                return res.status(404).json({ message: 'Паттерн не найден' });
            }
            await pattern.destroy();
            return res.status(200).json({ message: 'Паттерн успешно удалён' });
        } catch (error) {
            console.error("Ошибка при удалении паттерна:", error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    };
}

module.exports = new PatternController()