const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
 
async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  // Check if image size is greater than 1MB
  const imageSize = image._data.length;
  const maxSize = 1000000;
  if (imageSize > maxSize) {
    const response = h.response({
      status: 'fail',
      message: 'Payload content length greater than maximum allowed: 1000000'
    });
    response.code(413); // Payload Too Large
    return response;
  }

  try {
    const { confidenceScore, label, explanation, suggestion } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const data = {
      id,
      result: label,
      explanation,
      suggestion,
      confidenceScore,
      createdAt
    };
    await storeData(id, data);

    const message = confidenceScore > 99 ? 'Model is predicted successfully.' : 'Model is predicted successfully but under threshold. Please use the correct picture';
    const response = h.response({
      status: 'success',
      message,
      data
    });
    response.code(201); // Created
    return response;
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: 'Terjadi kesalahan dalam melakukan prediksi'
    });
    response.code(400); // Bad Request
    return response;
  }
}
 
module.exports = postPredictHandler;