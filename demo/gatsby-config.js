require('dotenv').config();

module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-transistorfm',
      options: {
        apiKey: process.env.TRANSISTOR_API_KEY,
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
  ],
};
