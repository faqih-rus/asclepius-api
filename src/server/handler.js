const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const InputError = require('../exceptions/InputError');

async function postPredictHandler(request, h) {
    try {
        const { image } = request.payload;
        if (!image) {
            throw new InputError('Gambar harus disertakan dalam permintaan.');
        }

        if (image.bytes > 1000000) {
            return h.response({
                status: 'fail',
                message: 'Payload content length greater than maximum allowed: 1000000'
            }).code(413);
        }

        const { model } = request.server.app;
        const { confidenceScore, label, suggestion } = await predictClassification(model, image._data);

        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const data = {
            "id": id,
            "result": label,
            "suggestion": suggestion,
            "createdAt": createdAt
        };

        const response = h.response({
            status: 'success',
            message: 'Model is predicted successfully',
            data
        });
        response.code(201);
        return response;
    } catch (error) {
        console.error('Error in postPredictHandler:', error);

        if (error instanceof InputError) {
            const response = h.response({
                status: 'fail',
                message: error.message
            });
            response.code(error.statusCode);
            return response;
        }

        const response = h.response({
            status: 'fail',
            message: 'Terjadi kesalahan dalam melakukan prediksi'
        });
        response.code(400);
        return response;
    }
}

module.exports = { postPredictHandler };
