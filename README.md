# gatsby-source-transistorfm
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://cartql.com"><img src="https://avatars3.githubusercontent.com/u/950181?v=4" width="100px;" alt=""/><br /><sub><b>Jamie Barton</b></sub></a><br /><a href="https://github.com/notrab/gatsby-source-transistorfm/commits?author=notrab" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!