require('dotenv').config();

module.exports = {
  plugins: [
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-source-transistorfm',
      options: {
        url: process.env.TRANSISTOR_URL,
      },
    },
  ],
};
