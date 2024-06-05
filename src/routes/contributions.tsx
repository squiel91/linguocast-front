import { Breadcrumb } from "@/ui/breadcrumb.ui"
import { ForwardLink } from "@/ui/forward-link.ui"

const Contributions = () => (
  <>
    <Breadcrumb current="Contributions terms" />
    <h1 className="text-3xl mb-8 font-bold">Contributions terms</h1>
    <div className='max-w-2xl space-y-4'>      
      <p>
        Linguocast is built for and by language learners. We welcome and encourage everyone to
        share and contribute to the community! Below you can
        get familiar with a few rules and guides to ensure the most benefit to the community.
      </p>
      <h2 className="text-xl font-bold pt-4 pb-2">Licensing</h2>
      <p>
        The content on Linguocast is licensed under 
        the <ForwardLink to="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">Creative Commons BY-NC-SA 4.0</ForwardLink> license, and the platform software is licensed under the <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer">MIT license</a>. This means that users can share and adapt the content, provided it's not for commercial purposes, they give appropriate credit, and they distribute any derivative works under the same license. The platform software can be freely used, modified, and distributed, with attribution to the original creators.
      </p>
      <p>
        All podcast content and comments on the platform are the sole
        responsibility of their authors and do not represent the views or opinions
        of Linguocast staff.
      </p>
      
      <h2 className="text-xl font-bold pt-4 pb-2">Adding New Podcasts</h2>
      <p>
        We welcome the addition of new podcasts to our directory, provided they
        are not exclusively intended for native speakers. We do not accept
        content that incites violence, harm, or any form of discrimination based
        on race, gender, sexual orientation, etc. The Linguocast curators will
        determine if the content meets these criteria. To get more involved in
        the curating process, join our <ForwardLink to="https://discord.com/invite/dBNT2BBk" target="_blank" rel="noopener noreferrer">Discord</ForwardLink> or write to <ForwardLink to="mailto:content@linguocast.com">content@linguocast.com</ForwardLink>.
      </p>
      
      <h2 className="text-xl font-bold pt-4 pb-2">Commenting on Podcasts and Episodes</h2>
      <p>
        Our goal is to foster an inclusive community focused on the language
        learning experience. We expect comments to be respectful and relevant
        to the content. Offensive, discriminatory, or excessively personal
        comments are not allowed. Comments flagged as offensive will be reviewed
        and may be censored. Users with multiple censored comments or those who
        post content that is flagrantly discriminatory or incites violence or
        self-harm will be banned. Moderators will review and determine each case
        based on its merits.
      </p>
      
      <h2 className="text-xl font-bold pt-4 pb-2">Development and Design</h2>
      <p>
        If you are interested in developing or designing new features, please
        review our planned features. Contact us at <ForwardLink to="mailto:platform@linguocast.com">platform@linguocast.com</ForwardLink> to
        align your efforts with our roadmap.
      </p>
    </div>
  </>
)

export default Contributions
