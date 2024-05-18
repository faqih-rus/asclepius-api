const { Firestore } = require('@google-cloud/firestore');
const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const InputError = require('../exceptions/InputError');
const { storeData } = require('../services/storeData');

const firestore = new Firestore();

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
            id,
            result: label,
            suggestion,
            createdAt
        };

        // Menyimpan data prediksi
        await storeData(id, data);

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

async function getHistoriesHandler(request, h) {
    try {
        const db = firestore;
        const predictCollection = db.collection('predictions');
        const snapshot = await predictCollection.get();
        
        // Log the size of the snapshot
        console.log(`Fetched ${snapshot.size} documents from Firestore.`);
        
        const histories = snapshot.docs.map((doc) => ({
            id: doc.id,
            history: doc.data(),
        }));

        return h.response({
            status: 'success',
            data: histories,
        }).code(200);
    } catch (error) {
        console.error('Error in getHistoriesHandler:', error);
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan dalam mengambil riwayat prediksi',
        }).code(500);
    }
}

module.exports = { postPredictHandler, getHistoriesHandler };
