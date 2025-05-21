const uuid = require('uuid')
const path = require('path')
const { Fabric } = require('../models/models')
const ApiError = require('../error/ApiError');

class FabricController {

    async create(req, res, next) {
        try {

            let { name } = req.body
            // const { img } = req.files
            // let fileName = uuid.v4() + ".jpg"
            // img.mv(path.resolve(__dirname, '..', 'static', fileName))
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
}

module.exports = new FabricController()