require('dotenv').config();

module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-transistorfm',
      options: {
        url: process.env.TRANSISTOR_URL,
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
  ],
};
