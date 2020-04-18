const Parser = require('rss-parser');
const { createRemoteFileNode } = require('gatsby-source-filesystem');

exports.sourceNodes = async (
  { actions: { createNode }, createNodeId, createContentDigest, reporter },
  { url }
) => {
  if (!url)
    return reporter.panicOnBuild(
      'gatsby-source-transistorfm: You must provide a url for your feed'
    );

  let feed;

  if (url.includes('http')) {
    feed = url;
  } else {
    feed = `https://feeds.transistor.fm/${url}`;
  }

  const parser = new Parser();

  const { items: episodes, ...show } = await parser.parseURL(feed);

  const processEpisode = async episode => {
    await createNode({
      ...episode,
      id: createNodeId(episode.guid),
      internal: {
        contentDigest: createContentDigest(episode),
        type: `TransistorEpisode`,
      },
    });
  };

  const processShow = async show => {
    await createNode({
      ...show,
      id: createNodeId(show.feedUrl),
      internal: {
        contentDigest: createContentDigest(show),
        type: `TransistorShow`,
      },
    });
  };

  await Promise.all([
    processShow(show),
    episodes.map(async episode => processEpisode(episode)),
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

  if (node.internal.type === `TransistorShow` && node.image && node.image.url) {
    let imageNode;

    try {
      const { id } = await createRemoteFileNode({
        url: node.image.url,
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
