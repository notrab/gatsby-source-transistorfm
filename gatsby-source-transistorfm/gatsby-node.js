const Parser = require("rss-parser");
const { createRemoteFileNode } = require("gatsby-source-filesystem");

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  { url }
) => {
  const { createNode } = actions;

  const parser = new Parser();

  const { title, description, image, copyright, items } = await parser.parseURL(
    url
  );

  items.forEach(item => {
    const nodeId = createNodeId(item.link);

    // let imageHref;

    // if (image) {
    //   const { url } = image;
    //   imageHref = url;
    // }

    // We should probably create a parent for the show, providing the image, title, description there

    createNode({
      ...item,
      image,
      copyright,
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        contentDigest: createContentDigest(item),
        type: `TransistorEpisode`
      }
    });
  });
};

exports.onCreateNode = async ({
  node,
  actions,
  store,
  cache,
  createNodeId
}) => {
  const { createNode } = actions;

  if (node.internal.type === "TransistorEpisode" && node.image) {
    let imageNode;

    try {
      imageNode = await createRemoteFileNode({
        url: node.image.url,
        store,
        cache,
        createNode,
        createNodeId
      });
    } catch (err) {
      console.error("gatsby-source-transistorfm: ERROR", e);
    }

    if (imageNode) {
      node.image___NODE = imageNode.id;
    }
  }
};
