const predictClassification = require('../services/inferenceService');

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  try {
    const result = await predictClassification(model, image);
    const response = h.response(result);
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