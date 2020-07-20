const accountSid = 'ACd2270faa6dcfb6da82f2c2840e6ad3b4';
const authToken = '89b5b5d1e2e6b36c2165bc6c6e8e4fe3';
const client = require('twilio')(accountSid, authToken);

module.exports = client