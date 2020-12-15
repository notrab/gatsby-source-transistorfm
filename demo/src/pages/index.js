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
      episodes {
        id
        attributes {
          formatted_summary
          media_url
          title
        }
      }
    }
  }
`;

const IndexPage = () => {
  const { show } = useStaticQuery(pageQuery);
  const {attributes, episodes} = show;

  return (
    <React.Fragment>
      <h1>{attributes.title}</h1>
      <p>{attributes.description}</p>

      <Img
        fluid={show.image.childImageSharp.fluid}
        style={{ width: '260px' }}
      />

      <hr />

      {episodes.map((episode) => (
        <article key={episode.id}>
          {/* <Img
            fluid={episode.image.childImageSharp.fluid}
            style={{ width: '260px' }}
          /> */}
          <h2>{episode.attributes.title}</h2>
          <p>{episode.attributes.formatted_summary}</p>
          <ReactAudioPlayer
            src={episode.attributes.media_url}
            controls
            preload="none"
          />
        </article>
      ))}
    </React.Fragment>
  );
};

export default IndexPage;
