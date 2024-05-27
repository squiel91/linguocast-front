import { createBrowserRouter } from "react-router-dom";
import Error from "./routes/error";
import Contributions from "./routes/contributions";
import MainTheme from "./themes/main/main.themes";
import PodcastListing from "./routes/podcasts/listing.podcasts";
import About from "./routes/about/about";
import ViewPodcast from "./routes/podcasts/view.podcasts";
import SharePodcast from "./routes/podcasts/edit/edit.podcasts";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PodcastListing />,
    errorElement: <Error />
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
      },
    ],
    errorElement: <Error />
  },
])
