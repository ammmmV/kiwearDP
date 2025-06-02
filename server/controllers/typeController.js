const {Type} = require('../models/models')
const ApiError = require('../error/ApiError');
const uuid = require('uuid')
const path = require('path')

class TypeController {
    async create(req, res, next) {
        try {
            const {name} = req.body
            const type = await Type.create({name})
            return res.json(type)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        const types = await Type.findAll()
        return res.json(types)
    }
    
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            
            const type = await Type.findByPk(id);
            if (!type) {
                return res.status(404).json({ message: 'Фурнитура не найдена' });
            }
            
            if (name !== undefined) type.name = name;
            
            await type.save();
            
            return res.json({ message: 'Обновление выполнено успешно', type });
        } catch (error) {
            console.error('Ошибка при обновлении фурнитуры:', error);
            next(ApiError.badRequest(error.message))
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            
            const type = await Type.findByPk(id);
            if (!type) {
                return res.status(404).json({ message: 'Фурнитура не найдена' });
            }
            
            await type.destroy();
            
            return res.json({ message: 'Фурнитура успешно удалена' });
        } catch (error) {
            console.error('Ошибка при удалении фурнитуры:', error);
            next(ApiError.badRequest(error.message))
        }
    }
}

module.exports = new TypeController()