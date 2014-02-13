var testosterone = require('testosterone')({port: 5000})
  , assert = testosterone.assert;

testosterone
  .post('/hi', {data: {message: 'hola'}}, {
    status: 200
  , body: 'hola'
  });