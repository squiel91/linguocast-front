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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PlayerContextWrapper />,
    errorElement: <Error />,
    children: [

      {
        path: "/",
        element: <ListPodcast />,
      },
      {
        path: "/",
        element: <MainTheme />,
        children: [
          {
            path: '/podcasts/:podcastId/:podcastName?',
            element: <ViewPodcast />
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
