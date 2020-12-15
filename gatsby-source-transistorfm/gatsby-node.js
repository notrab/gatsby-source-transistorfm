const axios = require('axios').default;
const { createRemoteFileNode } = require('gatsby-source-filesystem');

exports.sourceNodes = async (
  { actions: { createNode }, createNodeId, createContentDigest, reporter },
  { apiKey }
) => {
  if (!apiKey)
    return reporter.panicOnBuild(
      'gatsby-source-transistorfm: You must provide an apiKey for your feed'
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
    const activity = reporter.activityTimer(
      `fetching all Show Nodes from Transistor FM`,
      {}
    );
    activity.start();
    try {
      const {
        data: { data },
      } = await createGetRequest('/shows', {});
      activity.end();
      return data;
    } catch (error) {
      console.error(error);
      activity.end();
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

  const getAllEpisodes = async () => {
    const activity = reporter.activityTimer(
      `fetching all Episode Nodes from Transistor FM`,
      {}
    );
    activity.start();
    const nodes = [];
    let fetchNodes = true;
    let fetchNodesLoop = 1;
    const nodesPerPage = 20;
    while (fetchNodes) {
      try {
        activity.setStatus(`Getting page ${fetchNodesLoop} of Episodes`);
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
        reporter.panic(`Error getting Episodes from Transistor FM`, error);
        throw Error(`Error getting Episodes from Transistor FM`);
      }

      fetchNodesLoop++;
    }
    activity.end();
    return nodes;
  };

  const shows = await getShows();
  const allEpisodes = await getAllEpisodes();

  const processEpisode = async ({ episode }) => {
    const { id, attributes } = episode;
    await createNode({
      ...episode,
      id: createNodeId(id),
      attributes: {
        ...attributes,
        id,
      },
      internal: {
        contentDigest: createContentDigest(episode),
        type: `TransistorEpisode`,
      },
    });
  };

  const processShow = async ({ show }) => {
    await createNode({
      ...show,
      id: createNodeId(show.id),
      internal: {
        contentDigest: createContentDigest(show),
        type: `TransistorShow`,
      },
    });
  };

  await Promise.all([
    shows.map(async (show) => processShow({ show })),
    allEpisodes.map(async (episode) => processEpisode({ episode })),
  ]);
};

exports.onCreateNode = async ({
  node,
  actions,
  store,
  cache,
  createNodeId,
  reporter,
}) => {
  if (node.internal.type === `TransistorShow` && node.attributes.image_url) {
    const { createNode } = actions;
    let imageNode;
    try {
      const { id } = await createRemoteFileNode({
        url: node.attributes.image_url,
        parentNodeId: node.id,
        store,
        cache,
        createNode,
        createNodeId,
      });
      imageNode = id;
    } catch (err) {
      reporter.error('gatsby-source-transistorfm', err);
    }

    node.image___NODE = imageNode;
  }
};
