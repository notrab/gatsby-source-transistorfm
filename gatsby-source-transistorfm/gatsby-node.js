const Parser = require('rss-parser');
const { createRemoteFileNode } = require('gatsby-source-filesystem');

exports.sourceNodes = async (
  { actions, cache, createNodeId, createContentDigest, reporter, store },
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

  const { createNode } = actions;

  const parser = new Parser();

  const { items, image, ...show } = await parser.parseURL(feed);

  const imageUrl = image && image.url;

  items.forEach(item => {
    const nodeId = createNodeId(item.link);

    createNode({
      ...item,
      id: nodeId,
      internal: {
        contentDigest: createContentDigest(item),
        type: `TransistorEpisode`,
      },
    });
  });

  await createNode({
    ...show,
    id: url,
    imageUrl,
    internal: {
      type: `TransistorShow`,
      contentDigest: createContentDigest(show),
    },
  });
};

exports.onCreateNode = async ({
  node,
  actions,
  store,
  cache,
  createNodeId,
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
