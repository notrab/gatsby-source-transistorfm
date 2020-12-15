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
        reporter.panic(
          `Error getting Episodes from Transistor FM`,
          error
        );
        throw Error(`Error getting Episodes from Transistor FM`);
      }

      fetchNodesLoop++;
    }
    return nodes;
  };

  const shows = await getShows();
  const allEpisodes = await getAllEpisodes();


  const processEpisode = async ({ episode, show }) => {
    await createNode({
      ...episode,
      id: createNodeId(episode.guid),
      show___NODE: createNodeId(show.feedUrl),
      internal: {
        contentDigest: createContentDigest(episode),
        type: `TransistorEpisode`,
      },
    });
  };

  const processShow = async ({ show, episodes }) => {
    const { image, ...rest } = show;
    const imageUrl = image && image.url;

    await createNode({
      ...rest,
      imageUrl,
      id: createNodeId(show.feedUrl),
      episodes___NODE: episodes.map((episode) => createNodeId(episode.guid)),
      internal: {
        contentDigest: createContentDigest(show),
        type: `TransistorShow`,
      },
    });
  };

  await Promise.all([
    shows.map(async (show) => processShow({ show, episodes })),
    allEpisodes.map(async (episode) => processEpisode({ episode, show })),
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
  const { createNode } = actions;
  if (node.internal.type === `TransistorEpisode` && node.itunes.image) {
    let imageNode;

    try {
      const { id } = await createRemoteFileNode({
        url: node.itunes.image,
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

  if (node.internal.type === `TransistorShow` && node.imageUrl) {
    let imageNode;

    try {
      const { id } = await createRemoteFileNode({
        url: node.imageUrl,
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
