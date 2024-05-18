const { postPredictHandler, getHistoriesHandler } = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/predict',
    handler: postPredictHandler,
    options: {
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
      },
    },
  },
  {
    method: 'GET',
    path: '/predict/histories', 
    handler: getHistoriesHandler, 
  },
];

module.exports = routes;
