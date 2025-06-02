const uuid = require('uuid')
const path = require('path')
const { Fabric } = require('../models/models')
const ApiError = require('../error/ApiError');

class FabricController {

    async create(req, res, next) {
        try {
            let { name } = req.body
            const fabric = await Fabric.create({ name });

            return res.json(fabric)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        const fabrics = await Fabric.findAll()
        return res.json(fabrics)
    }
    
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            
            const fabric = await Fabric.findByPk(id);
            if (!fabric) {
                return res.status(404).json({ message: 'Ткань не найдена' });
            }
            
            if (name !== undefined) fabric.name = name;
            
            await fabric.save();
            
            return res.json({ message: 'Обновление выполнено успешно', fabric });
        } catch (error) {
            console.error('Ошибка при обновлении ткани:', error);
            next(ApiError.badRequest(error.message))
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            
            const fabric = await Fabric.findByPk(id);
            if (!fabric) {
                return res.status(404).json({ message: 'Ткань не найдена' });
            }
            
            await fabric.destroy();
            
            return res.json({ message: 'Ткань успешно удалена' });
        } catch (error) {
            console.error('Ошибка при удалении ткани:', error);
            next(ApiError.badRequest(error.message))
        }
    }
}

module.exports = new FabricController()