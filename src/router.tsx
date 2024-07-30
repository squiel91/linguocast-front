import { createBrowserRouter } from 'react-router-dom';
import Error from './routes/error';
import Contributions from './routes/contributions';
import MainTheme from './themes/main/main.themes';
import ListPodcast from './routes/podcasts/list.podcasts';
import About from './routes/about/about';
import ViewPodcast from './routes/podcasts/view/view.podcasts';
import ManagePodcast from './routes/podcasts/edit/podcast.creators';
import { PlayerContextWrapper } from './themes/player/player';
import ViewEpisode from './routes/episodes/view.episodes';
import Profile from './routes/profile';
import Feed from './routes/feed/feed';
import EntryPoint from './routes/entry-point';
import ViewUser from './routes/view.users';
import Premium from './routes/premium';
import LearningJourney from './routes/learning-journey';
import { ManageEpisode } from './routes/episodes/episodes.creators';
import VocabularyCorner from './routes/vocabulary-corner';
import { CreatorsPayouts } from './routes/payouts.creators';
import { CreatorsListPodcasts } from './routes/list.podcasts.creators';
import CreatePodcast from './routes/podcasts/create/create.podcasts';
import { PodcastOverview } from './routes/podcasts/edit/overview.podcasts.creators';
import { CreatorsListPodcastEpisodes } from './routes/podcasts/edit/episodes.podcasts.creators';
import { PodcastSettings } from './routes/podcasts/edit/settings.podcasts.creators';
import { PodcastEdit } from './routes/podcasts/edit/edit.podcast.creator';
import { EpisodeTranscript } from './routes/episodes/transcript.episodes.creators';
import { EpisodeExercises } from './routes/episodes/exercises.episodes.creators';
import { EpisodeEmbeddeds } from './routes/episodes/embeddeds.episodes.creators';
import { EpisodeSettings } from './routes/episodes/settings.episodes.creators';
import { EpisodeOverview } from './routes/episodes/overview.episodes.creators';
import { EpisodeEdit } from './routes/episodes/edit.episodes.creators';
import { CreatorsLanding } from './routes/creators-landing';
import { CreatorsTerms } from './terms.creators';
import { CreatorsHelp } from './help.creators';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PlayerContextWrapper />,
    errorElement: <Error />,
    children: [      
      {
        path: '/',
        element: <EntryPoint />
      },
      {
        path: '/creators',
        element: <CreatorsLanding />
      },
      {
        path: '/',
        element: <MainTheme />,
        children: [
          {
            path: '/explore',
            element: <ListPodcast />
          },
          {
            path: '/journey',
            element: <LearningJourney />
          },
          {
            path: '/vocabulary',
            element: <VocabularyCorner />
          },
          {
            path: '/premium',
            element: <Premium />
          },
          {
            path: '/users/:userId/:userName?',
            element: <ViewUser />
          },
          {
            path: '/feed',
            element: <Feed />
          },
          {
            path: '/profile',
            element: <Profile />
          },
          {
            path: '/creators/profile',
            element: <Profile />
          },
          {
            path: '/podcasts/:podcastId/:podcastName?',
            element: <ViewPodcast />
          },
          {
            path: '/creators/terms',
            element: <CreatorsTerms />
          },
          {
            path: '/creators/help',
            element: <CreatorsHelp />
          },
          {
            path: '/creators/earnings',
            element: <CreatorsPayouts />
          },
          {
            path: '/creators/podcasts',
            element: <CreatorsListPodcasts />
          },
          {
            path: '/creators/podcasts/source',
            element: <CreatePodcast />
          },
          {
            path: '/creators/podcasts',
            element: <ManagePodcast />,
            children: [
              { path: 'new', element: <PodcastEdit /> }
            ]
          },
          {
            path: '/creators/podcasts/:podcastId',
            element: <ManagePodcast />,
            children: [
              { path: 'overview', element: <PodcastOverview /> },
              { path: 'episodes', element: <CreatorsListPodcastEpisodes /> },
              { path: 'edit', element: <PodcastEdit /> },
              { path: 'settings', element: <PodcastSettings /> }
            ]
          },
          {
            path: '/creators/podcasts/:podcastId/episodes',
            element: <ManageEpisode />,
            children: [
              { path: 'new', element: <EpisodeEdit /> }
            ]
          },
          {
            path: '/creators/podcasts/:podcastId/episodes/:episodeId',
            element: <ManageEpisode />,
            children: [
              { path: 'overview', element: <EpisodeOverview /> },
              { path: 'edit', element: <EpisodeEdit /> },
              { path: 'transcript', element: <EpisodeTranscript /> },
              { path: 'exercises', element: <EpisodeExercises /> },
              { path: 'embeddeds', element: <EpisodeEmbeddeds /> },
              { path: 'settings', element: <EpisodeSettings /> }
            ]
          },
          {
            path: '/episodes/:episodeId/:episodeName?',
            element: <ViewEpisode />
          },
          {
            path: '/help',
            element: <About />
          },
          {
            path: '/terms',
            element: <Contributions />
          }
        ],
        errorElement: <Error />
      }
    ]
  }
])
