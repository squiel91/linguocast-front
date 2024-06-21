import { createBrowserRouter } from "react-router-dom";
import Error from "./routes/error";
import Contributions from "./routes/contributions";
import MainTheme from "./themes/main/main.themes";
import ListPodcast from "./routes/podcasts/list.podcasts";
import About from "./routes/about/about";
import ViewPodcast from "./routes/podcasts/view/view.podcasts";
import SharePodcast from "./routes/podcasts/edit/edit.podcasts";
import { PlayerContextWrapper } from "./themes/player/player";
import ViewEpisode from "./routes/episodes/view.episodes";
import Profile from "./routes/profile";
import Feed from "./routes/feed/feed";
import EntryPoint from "./routes/entry-point";
import ViewUser from "./routes/view.users";
import Premium from "./routes/premium";
import LearningJourney from "./routes/learning-journey";
import { EditEpisode } from "./routes/episodes/edit.episodes";
import VocabularyCorner from "./routes/vocabulary-corner";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PlayerContextWrapper />,
    errorElement: <Error />,
    children: [      
      {
        path: "/",
        element: <EntryPoint />
      },
      {
        path: "/explore",
        element: <ListPodcast />
      },
      {
        path: "/",
        element: <MainTheme />,
        children: [
          {
            path: '/journey',
            element: <LearningJourney />
          },
          {
            path: '/vocabulary-corner',
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
            path: '/podcasts/:podcastId/:podcastName?',
            element: <ViewPodcast />
          },
          {
            path: '/creators/episodes/:episodeId',
            element: <EditEpisode />
          },
          {
            path: '/episodes/:episodeId/:episodeName?',
            element: <ViewEpisode />
          },
          {
            path: '/podcasts/:podcastId/:podcastName?/edit',
            element: <SharePodcast />
          },
          {
            path: '/podcasts/share',
            element: <SharePodcast />
          },
          {
            path: '/about',
            element: <About />
          },
          {
            path: '/contributions',
            element: <Contributions />
          }
        ],
        errorElement: <Error />
      }
    ]
  }
])
