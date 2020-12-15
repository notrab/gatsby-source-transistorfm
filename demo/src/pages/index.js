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
