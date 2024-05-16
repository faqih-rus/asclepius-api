const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  try {
    const result = await predictClassification(model, image);
    const { confidenceScore, label, explanation, suggestion } = result;
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const data = { id, result: label, explanation, suggestion, confidenceScore, createdAt };

    const response = h.response({
      status: 'success',
      message: confidenceScore > 99 ? 'Model is predicted successfully.' : 'Model is predicted successfully but under threshold. Please use the correct picture',
      data
    });

    response.code(201);
    return response;
  } catch (error) {
    const errorResponse = h.response({
      status: 'fail',
      message: error.message
    });

    errorResponse.code(error.statusCode || 500);
    return errorResponse;
  }
}

module.exports = postPredictHandler;
