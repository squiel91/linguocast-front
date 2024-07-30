import { HeroContent } from "@/components/hero-content"
import { Button } from "@/ui/button.ui"
import { useQuery } from "@tanstack/react-query"
import { CoinsIcon, InfoIcon, LandmarkIcon, WalletIcon } from "lucide-react"
import axios from "axios"
import { ICompletePodcast } from "@/types/types"
import noImage from '@/assets/no-image.svg'
import { useTitle } from "@/utils/document.utils"

export const CreatorsPayouts = () => {

  const { data: userPodcasts } = useQuery({
    queryKey: ['creator-podcasts'],
    queryFn: () => axios.get<ICompletePodcast[]>('/api/creators/podcasts').then(res => res.data)
  })

  useTitle('My Earnings')

  return (
    <div className="container">
      <section className="mb-12">
        <div className="mt-8 mb-8 flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-4xl">Earnings</h1>
          <Button disabled>Generate Payout</Button>
        </div>
        <div className='col-span-2 border-2 mt-8 mb-8 border-slate-200 rounded-md p-4 flex gap-4 items-center text-sm'>
          <InfoIcon size={20} className="shrink-0" />
          You can generate a Paypal, Payoneer or Wise payout once you reached $100 in unpaid earnings. A payout will be automatically generated after reaching $500.
        </div>
        <div className="grid grid-cols-3 gap-8">
          <HeroContent hero={<div className="text-3xl">$<span className="text-4xl">0</span></div>} description="Unpaid earnings" icon={<CoinsIcon />}  />
          <HeroContent hero={<div className="text-3xl">$<span className="text-4xl">0</span></div>} description="In process payouts" icon={<LandmarkIcon />}  />
          <HeroContent hero={<div className="text-3xl">$<span className="text-4xl">0</span></div>} description="Total earned" icon={<WalletIcon />}  />
        </div>
      </section>
      <section className="my-12">
        <h2 className="text-2xl mb-4">Earned by podcasts</h2>
        {(userPodcasts?.length ?? 0) > 0
          ? (
            <table className="w-full">
              <tbody>
                <tr>
                  <th>Podcast</th>
                  <th>Total listens</th>
                  <th>Premium listens</th>
                  <th>Revenue pool</th>
                  <th>Revenue</th>
                </tr>
                {userPodcasts?.map(podcast => (
                  <tr key={podcast.id}>
                    <td className="flex gap-4 items-center">
                      <img src={podcast.image ?? noImage} className="w-12 rounded-md" />
                      {podcast.name}
                    </td>
                    <td>
                      {podcast.uniqueReproductions}
                    </td>
                    <td>
                      0
                    </td>
                    <td>
                      0 %
                    </td>
                    <td>
                      $ 0
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
          : <p>You dont't have any podcast yet.</p>}
      </section>
      <section className="my-12">
        <h2 className="text-2xl mb-4">Payout history</h2>
        <p>You dont't have any payouts yet.</p>
      </section>
    </div>
  )
}
