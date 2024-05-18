require('dotenv').config();

const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const loadModel = require('./services/loadModel');
const InputError = require('./exceptions/InputError');
const ClientError = require('./exceptions/ClientError');

(async () => {
    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0',  // Mengubah ke '0.0.0.0' untuk deployment
        routes: {
            cors: {
                origin: ['*'],
            },
            payload: {
                maxBytes: 1000000, // Membatasi ukuran payload ke 1MB
                multipart: true
            }
        },
    });

    const model = await loadModel();
    server.app.model = model;

    server.route(routes);

    server.ext('onPreResponse', function (request, h) {
        const response = request.response;

        if (response instanceof ClientError) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message
            });
            newResponse.code(response.statusCode);
            return newResponse;
        }

        if (response.isBoom) {
            let message = 'Terjadi kesalahan dalam melakukan prediksi';
            let statusCode = response.output.statusCode;

            if (statusCode === 413) {
                message = 'Payload content length greater than maximum allowed: 1000000';
            }

            const newResponse = h.response({
                status: 'fail',
                message: message
            });
            newResponse.code(statusCode);
            return newResponse;
        }

        return h.continue;
    });

    await server.start();
    console.log(`Server started at: ${server.info.uri}`);
})();
