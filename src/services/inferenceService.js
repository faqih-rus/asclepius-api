require('dotenv').config();
const tf = require('@tensorflow/tfjs-node');
const { v4: uuidv4 } = require('uuid');
const InputError = require('../exceptions/InputError');

async function loadModelFromUrl() {
  const modelUrl = process.env.MODEL_URL;
  try {
    const model = await tf.loadGraphModel(modelUrl);
    return model;
  } catch (error) {
    throw new Error(`Gagal memuat model dari URL: ${error.message}`);
  }
}

async function predictClassification(image) {
  try {
    const model = await loadModelFromUrl();
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims(0)
      .toFloat();
    const prediction = model.predict(tensor);
    const [classResult] = prediction.squeeze().dataSync();
    const label = classResult === 1 ? "Cancer" : "Non-cancer";
    const suggestion = label === "Cancer" ? "Segera periksa ke dokter!" : "Tidak terdeteksi kanker.";
    const id = uuidv4();
    const createdAt = new Date().toISOString();

    return {
      status: "success",
      message: "Model is predicted successfully",
      data: {
        id,
        result: label,
        suggestion,
        createdAt
      }
    };
  } catch (error) {
    throw new InputError(`Terjadi kesalahan input: ${error.message}`);
  }
}

module.exports = predictClassification;