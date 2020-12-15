const axios = require('axios').default;

module.exports.test = async function (apiKey) {
  if (!apiKey)
    return reporter.panicOnBuild(
      'gatsby-source-transistorfm: You must provide an api key for your feed'
    );

  const apiBase = 'https://api.transistor.fm/v1';
  const createGetRequest = async (path, params) => {
    return await axios.get(`${apiBase}${path}`, {
      ...params,
      headers: {
        'x-api-key': apiKey,
      },
    });
  };

  const getShows = async () => {
    try {
      const {
        data: { data: shows },
      } = await createGetRequest('/shows', {});

      return shows;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const getEpisodes = async (page = 1, perPage = 10) => {
    try {
      const { data } = await createGetRequest(
        `/episodes?pagination[page]=${page}&pagination[per]=${perPage}`
      );
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  const nodes = [];
  let fetchNodes = true;
  let fetchNodesLoop = 1;
  const nodesPerPage = 20;

  const processAllEpisodes = async () => {
    while (fetchNodes) {
  
      try {
        // activity.setStatus(`getting data from "${apiUrl}"`);
        const episodeNodes = await getEpisodes(fetchNodesLoop, nodesPerPage);
  
        // Process nodes, if we have any
        if (episodeNodes.data && episodeNodes.data.length > 0) {
          episodeNodes.data.forEach((epNode) => {
            nodes.push(epNode);
          });
        } else {
          // stop the loop if we run out of nodes
          fetchNodes = false;
        }
      } catch (error) {
      
        console.error(error)
      }
  
      // IMPORTANT: increment the loop!
      fetchNodesLoop++;
    }
  };

  await processAllEpisodes();
  
};
