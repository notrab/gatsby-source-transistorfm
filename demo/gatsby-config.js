require('dotenv').config();

module.exports = {
  plugins: [
    {
      resolve: 'gatsby-theme-transistorfm',
      options: {
        url: process.env.TRANSISTOR_URL,
      },
    },
  ],
};
