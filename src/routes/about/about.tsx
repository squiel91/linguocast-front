import { FollowLink } from "@/ui/follow-link.ui"

import ezeAvatar from './eze-avatar.jpg'

const About = () => (
  <>
    <h1 className="text-3xl mb-8 font-bold">About Linguocast</h1>
    <div className='grid md:grid-cols-3 gap-16'>
      <div className='md:col-span-2 max-w-2xl space-y-4'>
        <p>
          Podcasts are a fantastic way to learn—they're informative, engaging,
          and just plain fun. Listening to podcasts that match your learning stage boosts your
          listening skills, expands your vocabulary, and even lets you practice
          reading with transcripts. Why not use them to learn a language faster
          and more effectively? That's exactly what we intend to do!
        </p>
        <p>
          Linguocast initial mission is to curate the ultimate podcast catalog
          for language learners, from beginners to advanced. This is too big of a
          task for one person, or even a
          whole company. That's why we decided to rely in the language learning
          vibrant community. As they discover their next favorite learning podcast, in
          turn, they share with others those hidden gems they've found along the way!
          Other ways of contributing is by suggest edits, comment and review shows,
          join our Discord to help shape the future of the platform, or even
          develop/design new features.
        </p>
        <p>
          Our content is licensed under <FollowLink to="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">Creative Commons</FollowLink>, and our platform software is under
          the <FollowLink to="https://opensource.org/license/mit" target="_blank">MIT License</FollowLink>. Yes, Linguocast is truly open-source and
          community-powered.
        </p>
        <p>
          As you dive into new podcasts and practice with them, get ready for
          exciting updates! You can track all the planned features and their
          status <FollowLink to="https://docs.google.com/spreadsheets/d/1BYnQQWPUC16IfRmMpgWziL6rMOwVcxzWhaXBHa1rKtY/edit" target="_blank">here</FollowLink>.
          If you're a developer or designer eager to speed things up, drop us a line at <FollowLink to="mailto:platform@linguocast.com">platform@linguocast.com</FollowLink>!
        </p>
        <p>
          Our long-term vision? To be the go-to platform where language learners
          and content creators connect. We aim to make every piece of content
          super effective for learners and provide a perfect platform for creators
          to maximize their reach and impact.
        </p>
        <p>
          We have big dreams. We want to be the top platform for learners to
          improve their language skills by listening, watching, and reading
          content from podcasters and creators. A place where creators can also
          monetize their creations by making them even more engaging and effective.
        </p>
        <p>
          Dive in, discover, and let's learn together with Linguocast!
        </p>
      </div>
      <div className='space-y-4'>
        <img
          src={ezeAvatar}
          className="
            border-[1px] border-solid border-slate-300 p-2
            w-26 md:w-32 h-26 md:h-32 lg:w-40 lg:h-40 rounded-full mb-8"
          />
        <p>
          Hey there! 👋 I'm Ezequiel Santiago, a software engineer from Uruguay
          and the founder of Linguocast.
        </p>
        <p>
          As you might have guessed, I'm a huge podcast fan. I love listening to
          shows about tech, politics, nutrition, and farming every now and then.
          Plus, I've been studying Chinese for over 10 years and even lived in
          China and Taiwan for three years! Chinese learning podcasts have been
          a game-changer for my listening skills and vocabulary.
        </p>
        <p>
          I love building things—whether it's woodworking, electronics, or
          software. When I couldn't find the perfect platform to harness the
          power of podcasts for learning, I decided to take the initiative.
        </p>
        <p>
          While I'm not super active on social media, you can always reach me
          via email at <FollowLink to="mailto:ezequiel@linguocast.com">
            ezequiel@linguocast.com</FollowLink>.
        </p>
        <p>
          Best of the lucks in your learning journey!
        </p>
      </div>
    </div>
  </>
)

export default About
