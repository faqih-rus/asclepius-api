const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
    try {
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat();

        const classes = ['Non-cancer', 'Cancer'];

        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = Math.max(...score) * 100;

        const classResult = tf.argMax(prediction, 1).dataSync()[0];
        const label = classes[classResult];

        let explanation, suggestion;

        if(label === 'Cancer') {
            explanation = "Cancer adalah pertumbuhan sel yang tidak normal dan tidak terkontrol.";
            suggestion = "Segera periksa ke dokter!";
        }

        if(label === 'Non-cancer') {
            explanation = "Ini bukan cancer.";
            suggestion = "Tidak terdeteksi kanker.";
        }

        return { confidenceScore, label, explanation, suggestion };
    } catch (error) {
        throw new InputError(`Terjadi kesalahan input: ${error.message}`);
    }
}

module.exports = predictClassification;
