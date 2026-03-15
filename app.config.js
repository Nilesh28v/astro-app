require('dotenv').config();

module.exports = {
  expo: {
    ...require('./app.json').expo,
    extra: {
      ...(require('./app.json').expo?.extra || {}),
      apiUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000',
    },
  },
};
