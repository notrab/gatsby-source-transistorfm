import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Img from 'gatsby-image';
import ReactAudioPlayer from 'react-audio-player';

const pageQuery = graphql`
  {
    show: transistorShow {
      id
      description
      title
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
          <ReactAudioPlayer src={episode.enclosure.url} controls />
        </article>
      ))}
    </React.Fragment>
  );
};

export default IndexPage;
