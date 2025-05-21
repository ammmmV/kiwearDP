const {Type} = require('../models/models')
const ApiError = require('../error/ApiError');
const uuid = require('uuid')
const path = require('path')

class TypeController {
    async create(req, res, next) {
        try {
            const {name} = req.body
            // const {img} = req.files
            // let fileName = uuid.v4() + ".jpg"
            // img.mv(path.resolve(__dirname, '..', 'static', fileName))
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
}

module.exports = new TypeController()