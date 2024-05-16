const tf = require('@tensorflow/tfjs-node');
const { v4: uuidv4 } = require('uuid');

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();
    const prediction = model.predict(tensor);
    const classResult = tf.argMax(prediction, 1).dataSync()[0];
    const label = classes[classResult];
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