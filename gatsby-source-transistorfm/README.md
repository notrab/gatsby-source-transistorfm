# gatsby-source-transistorfm

🎙 Gatsby source plugin for fetching show and episode data from [Transistor](https://transistor.fm).

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
      url: '...',
    },
  },
];
```

### Example

```js
// In your pages/*.js
import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Img from 'gatsby-image';
import ReactAudioPlayer from 'react-audio-player';

const pageQuery = graphql`
  {
    show: transistorShow {
      id
      title
      description
      image {
        childImageSharp {
          fluid(maxWidth: 560) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }

    episodes: allTransistorEpisode {
      nodes {
        id
        title
        content
        enclosure {
          url
        }
      }
    }
  }
`;

const IndexPage = () => {
  const {
    show,
    episodes: { nodes: episodes },
  } = useStaticQuery(pageQuery);

  return (
    <React.Fragment>
      <h1>{show.title}</h1>
      <p>{show.description}</p>

      <Img
        fluid={show.image.childImageSharp.fluid}
        style={{ width: '260px' }}
      />

      <hr />

      {episodes.map(episode => (
        <article key={episode.id}>
          <h2>{episode.title}</h2>
          <p>{episode.content}</p>
          <ReactAudioPlayer
            src={episode.enclosure.url}
            controls
            preload="none"
          />
        </article>
      ))}
    </React.Fragment>
  );
};

export default IndexPage;
```
