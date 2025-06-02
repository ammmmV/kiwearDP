const uuid = require('uuid')
const path = require('path')
const { Pattern, Review } = require('../models/models')
const ApiError = require('../error/ApiError');

class PatternController {
    async create(req, res, next){
        try {

            let {name, price, fabricId, typeId, description} = req.body
            const { img, pdf } = req.files

            let fileName = uuid.v4() + ".jpg"
            let imagePath = path.join('images', fileName)
            console.log(imagePath)
            img.mv(path.resolve(__dirname, '..', 'static', imagePath))
            
            let pdfFileName = null
            let pdfPath = null
            if (pdf) { 
                pdfFileName = uuid.v4() + ".pdf"
                pdfPath = path.join('pdfs', pdfFileName)
                pdf.mv(path.resolve(__dirname, '..', 'static', pdfPath))
            }

            const pattern = await Pattern.create({name, price, fabricId, typeId, img: imagePath, pdf:pdfPath, description});
            
            return res.json(pattern)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        let { typeId, fabricId, limit, page } = req.query;
        page = page || 1;
        limit = limit || 9;
        let offset = page * limit - limit;
        let patterns;

        const whereClause = {};
        if (typeId) {
            whereClause.typeId = typeId;
        }
        if (fabricId) {
            whereClause.fabricId = fabricId;
        }

        try {
            patterns = await Pattern.findAndCountAll({
                where: whereClause,
                limit,
                offset,
                include: [{
                    model: Review,
                    attributes: ['rating'], 
                    where: { status: 'APPROVED' },
                    required: false
                }],
                order: [['createdAt', 'DESC']] 
            });

            const patternsWithRating = patterns.rows.map(pattern => {
                let averageRating = 0;
                if (pattern.reviews && pattern.reviews.length > 0) {
                    const totalRating = pattern.reviews.reduce((sum, review) => sum + review.rating, 0);
                    averageRating = totalRating / pattern.reviews.length;
                }

               
                const patternData = pattern.toJSON();
                patternData.averageRating = parseFloat(averageRating.toFixed(1));
                delete patternData.reviews;

                return patternData;
            });

            return res.json({
                count: patterns.count,
                rows: patternsWithRating
            });

        } catch (e) {
            console.error("Ошибка при получении всех паттернов с рейтингами:", e);
            next(ApiError.internal('Ошибка при получении паттернов'));
        }
    }

    async getOne(req, res, next) {
        const { id } = req.params;
        try {
            const pattern = await Pattern.findOne({
                where: { id },
                include: [{
                    model: Review,
                    attributes: ['rating', 'comment', 'userId', 'date'],
                    where: { status: 'APPROVED' }, 
                    required: false
                }]
            });

            if (!pattern) {
                return next(ApiError.notFound('Паттерн не найден'));
            }

            let averageRating = 0;
            if (pattern.reviews && pattern.reviews.length > 0) {
                const totalRating = pattern.reviews.reduce((sum, review) => sum + review.rating, 0);
                averageRating = totalRating / pattern.reviews.length;
            }

            const patternData = pattern.toJSON();
            patternData.averageRating = parseFloat(averageRating.toFixed(1)); // Округляем

            delete patternData.reviews;

            return res.json(patternData);

        } catch (e) {
            console.error("Ошибка при получении одного паттерна с рейтингами:", e);
            next(ApiError.internal('Ошибка при получении паттерна'));
        }
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