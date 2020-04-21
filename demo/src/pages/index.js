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
      episodes {
        id
        title
        content
        enclosure {
          url
        }
        image {
          childImageSharp {
            fluid(maxWidth: 560) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
      image {
        childImageSharp {
          fluid(maxWidth: 560) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  }
`;

const IndexPage = () => {
  const { show } = useStaticQuery(pageQuery);

  return (
    <React.Fragment>
      <h1>{show.title}</h1>
      <p>{show.description}</p>

      <Img
        fluid={show.image.childImageSharp.fluid}
        style={{ width: '260px' }}
      />

      <hr />

      {show.episodes.map(episode => (
        <article key={episode.id}>
          <Img
            fluid={episode.image.childImageSharp.fluid}
            style={{ width: '260px' }}
          />
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
