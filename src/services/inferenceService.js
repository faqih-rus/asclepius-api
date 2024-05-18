const tf = require('@tensorflow/tfjs-node');

async function predictClassification(model, image) {
    try {
        const tensor = tf.node
            .decodeImage(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat();

        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = Math.max(...score) * 100;

        const classes = ['Benign', 'Cancer'];
        const classResult = tf.argMax(prediction, 1).dataSync()[0];
        const label = classes[classResult];

        let suggestion;

        if (label === 'Cancer') {
            suggestion = "Segera periksa ke dokter!";
        } else {
            suggestion = "Tidak ada indikasi kanker, tetap jaga kesehatan kulit.";
        }

        return { confidenceScore, label, suggestion };
    } catch (error) {
        throw new Error('Error in prediction');
    }
}

module.exports = predictClassification;
