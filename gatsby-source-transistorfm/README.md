# gatsby-source-transistorfm

🎙 Gatsby source plugin for fetching show and episode data from [Transistor](https://transistor.fm).

## Important version information

This plugin now supports the [Transistor API](https://developers.transistor.fm/)
For migration details, see below.

## Install

```bash
yarn add gatsby-source-transistorfm
```

## How to use

```js
// In your gatsby-config.js
plugins: [
  {
    resolve: 'gatsby-source-transistorfm',
    options: {
      apiKey: '...',
    },
  },
];
```

The plugin will return all shows and episodes related to the account that owns the API key (see example).

It's recommended that you store you api key in env variables (or some other secret store). You will find your API key on your Transistor Account page.

Note that is your regenerate your api key, you will need to update the plugin to relfect this, or builds may fail.

To use multiple Transistor api feeds, just add another instance of the plugin configuration to `gatsby-config.js`.

### Example

```js
// In your pages/*.js
import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Img from 'gatsby-image';
import ReactAudioPlayer from 'react-audio-player';

const pageQuery = graphql`
  {
    shows: allTransistorShow {
      nodes {
        id
        attributes {
          title
          category
          copyright
          description
          image_url
        }
        image {
          childImageSharp {
            fluid(maxWidth: 560) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        relationships {
          episodes {
            data {
              id
            }
          }
        }
      }
    }
    episodes: allTransistorEpisode {
      nodes {
        id
        attributes {
          id
          formatted_summary
          media_url
          number
          season
          title
        }
      }
    }
  }
`;

const IndexPage = () => {
  const { shows, episodes } = useStaticQuery(pageQuery);
  return (
    <React.Fragment>
      {shows.nodes.map((show) => {
        const { attributes: showAttributes, relationships } = show;
        return (
          <React.Fragment key={show.id}>
            <h1>{showAttributes.title}</h1>
            <p>{showAttributes.description}</p>

            <Img
              fluid={show.image.childImageSharp.fluid}
              style={{ width: '260px' }}
            />
            <p>Copyright: {showAttributes.copyright}</p>
            <p>{showAttributes.category}</p>
            <hr />

            {relationships.episodes.data.map((showEpisode) => {
              const episode = episodes.nodes.find(
                (ep) => ep.attributes.id === showEpisode.id
              );
              return episode ? (
                <article key={episode.id}>
                  <h2>{episode.attributes.title}</h2>
                  <p>{episode.attributes.formatted_summary}</p>
                  <ReactAudioPlayer
                    src={episode.attributes.media_url}
                    controls
                    preload="none"
                  />
                </article>
              ) : null;
            })}
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
};

export default IndexPage;
```

## Migrating from the earlier rss-based version

This plugin now supports the [Transistor API](https://developers.transistor.fm/).

This means that it now creates a new schema in Graphql, meaning existing sites may need a substantial update. If you would like to continue using an RSS feed, we recommend using a plugin such as [gatsby-source-rss-feed](https://www.gatsbyjs.com/plugins/gatsby-source-rss-feed/) to pull in from a url. The schema is very similar to the previous version of this plugin.

In this version, we have leveraged the relational aspect of the API architecture, by providing both an array of `TransiatorShow`s and a full collection of all episodes, regardless of show. Each show object contains relational data with ids of shows, and each episode contsinas relational data linking it to a related show. This can allow for more complex architecture, such as easily creating individual pages for shows/episodes and linking them back to their parent/child.
