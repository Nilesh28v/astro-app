require('dotenv').config();

module.exports = ({ config }) => {
  return {
    ...config,
    extra: {
      ...config.extra,
      apiUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000',
    },
  };
};
