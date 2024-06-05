import { PodcastIcon } from "lucide-react";
import { Card } from "../../ui/card.ui";
import githubLogo from './assets/github.svg'
import discordLogo from './assets/discord.svg'
import mitLogo from './assets/mit.svg'
import ccLogo from './assets/cc.svg'
import { ForwardLink } from "../../ui/forward-link.ui";
import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="bg-slate-100 text-gray-500 pt-20 pb-12 text-sm">
    <div className=" container grid md:grid-cols-2 gap-12">
      <div>
        <p className='mb-4'>
          Your go-to open-source language learning podcast directory. We're community-maintained and
          committed to offer the most comprehensive and up to date collection of shows.
        </p>
        <p>
          Got questions, ideas, or just want to say 'hey'? Drop us a line at <Link to='mailto:hey@linguocast.com' className='text-primary'>hey@linguocast.com</Link>!
        </p>
        <ul className='mt-8 flex flex-col gap-1'>
          <li>Get to know <ForwardLink to="about">this project</ForwardLink></li>
          <li>Have a sneak peek of the <ForwardLink to="https://docs.google.com/spreadsheets/d/1BYnQQWPUC16IfRmMpgWziL6rMOwVcxzWhaXBHa1rKtY" target='_blank'>coming features</ForwardLink></li>
          <li>Check the <ForwardLink to="/contributions">contribution terms</ForwardLink></li>
        </ul>
      </div>
      <div>
        <div className='mb-4 font-bold text-sm'>How can I contribute?</div>
        <ul className='flex flex-col gap-3'>
          <li>
            <Link to="/share-podcast" className='w-full text-left'>
              <Card className='flex gap-5 items-center p-4 bg-slate-100 text-slate-600'>
                <PodcastIcon className='w-12 h-12 text-slate-500' />
                <div>
                  <div >Share language learning podcasts</div>
                  <p className='text-xs'>Add that missing podcasts others are eager to discover.</p>
                </div>
              </Card>
            </Link>          
          </li>
          <li>
            <a href="https://discord.gg/dBNT2BBk" target='_blank'>
              <Card className='flex gap-5 items-center p-4 bg-slate-100'>
                <img src={discordLogo} alt="Discod" className='w-12' />                  
                <div>
                  <div>Join the Discord group</div>
                  <p className='text-xs'>Discuss the future of the platform or bocome a moderator.</p>
                </div>
              </Card>
            </a>
          </li>
          <li>
            <a href="https://github.com/squiel91/linguocast" target='_blank'>
              <Card className='flex gap-5 items-center p-4 bg-slate-100'>
                <img src={githubLogo} alt="Github" className='w-12' />
                <div>
                  <div>Help develop the next feature</div>
                  <p className='text-xs'>Help accelerate the development of coming features.</p>
                </div>
              </Card>
            </a>
          </li>
        </ul>
      </div>
      <div className='md:col-span-2 md:border-t-[1px] border-slate-300 md:pt-4 mb-8 text-xs md:text-sm'>
        <div className="mb-2 flex gap-3 flex-col">
          <div className="flex gap-4 items-center">
            <img src={ccLogo} width={120} />
            <img src={mitLogo} width={48} />
          </div>
          <div>
            The podcast directory data is licensed under <ForwardLink to="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">Creative Commons BY-NC-SA 4.0</ForwardLink><br />
            The platform (as the software) is licesed under <ForwardLink to="https://opensource.org/license/mit" target="_blank">The MIT License</ForwardLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
)
