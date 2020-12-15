import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Img from 'gatsby-image';
import ReactAudioPlayer from 'react-audio-player';

const pageQuery = graphql`
  {
    show: transistorShow {
      id
      attributes {
        title
        author
        category
        copyright
        created_at
        description
        image_url
        keywords
        language
        multiple_seasons
        owner_email
        password_protected_feed
        playlist_limit
        private
        secondary_category
        show_type
        slug
        spotify
        time_zone
        website
        updated_at
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
    episodes: allTransistorEpisode {
      edges {
        node {
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
  }
`;

const IndexPage = () => {
  const { show, episodes } = useStaticQuery(pageQuery);
  const { attributes: showAttributes, relationships } = show;

  return (
    <React.Fragment>
      <h1>{showAttributes.title}</h1>
      <p>{showAttributes.description}</p>

      <Img
        fluid={show.image.childImageSharp.fluid}
        style={{ width: '260px' }}
      />

      <hr />

      {relationships.episodes.data.map((showEpisode) => {
        const episode = episodes.edges.find(ep => ep.node.attributes.id === showEpisode.id);
        return episode ? (
          <article key={episode.node.id}>
            <h2>{episode.node.attributes.title}</h2>
            <p>{episode.node.attributes.formatted_summary}</p>
            <ReactAudioPlayer
              src={episode.node.attributes.media_url}
              controls
              preload="none"
            />
          </article>
        ) : null;
      })}
    </React.Fragment>
  );
};

export default IndexPage;
