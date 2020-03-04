const Parser = require('rss-parser');
const { createRemoteFileNode } = require('gatsby-source-filesystem');

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest, reporter },
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

  const { items, ...store } = await parser.parseURL(feed);

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
    ...store,
    id: url,
    internal: {
      type: `TransistorShow`,
      contentDigest: createContentDigest(store),
    },
  });
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

  if (node.internal.type === 'TransistorShow' && node.image) {
    let imageNode;

    try {
      imageNode = await createRemoteFileNode({
        url: node.image.url,
        store,
        cache,
        createNode,
        createNodeId,
      });
    } catch (err) {
      reporter.error('gatsby-source-transistorfm', e);
    }

    if (imageNode) {
      node.image___NODE = imageNode.id;
    }
  }
};
