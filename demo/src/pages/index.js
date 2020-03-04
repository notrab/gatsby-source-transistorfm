import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import ReactAudioPlayer from 'react-audio-player';

const pageQuery = graphql`
  {
    show: transistorShow {
      id
      description
      title
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
