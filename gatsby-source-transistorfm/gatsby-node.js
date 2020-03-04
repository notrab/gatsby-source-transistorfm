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

  if (image && image.url) {
    let imageNode;

    try {
      const { id } = await createRemoteFileNode({
        url: image.url,
        parentNodeId: show.id,
        store,
        cache,
        createNode,
        createNodeId,
      });

      imageNode = id;
    } catch (err) {
      reporter.error('gatsby-source-transistorfm', err);
    }

    await createNode({
      ...show,
      id: url,
      image___NODE: imageNode,
      internal: {
        type: `TransistorShow`,
        contentDigest: createContentDigest(show),
      },
    });
  }
};
