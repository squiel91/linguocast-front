import { BookOpenCheckIcon, BrushIcon, Maximize2Icon, RepeatIcon } from "lucide-react";
import { CollapsableInfo } from "./ui/collapsable-info.ui";
import { ForwardLink } from "./ui/forward-link.ui";

export const CreatorsHelp = () => (
  <div className="container">
    <h1 className="text-3xl mb-8 mt-8">Creators FAQ</h1>
    <div className='space-y-4 md:space-y-8'>
      <CollapsableInfo
        top="What is Linguocast?"
      >
        <p className="mb-4">
          We are the podcast platform for language learners.
          Our mission is to bring learners and creators together around the most engaing and impactful content.
          We partner with awesome content creators like you to distribute your language learning content in the most impactful way so you can live from your passion, creating awesome content for teaching your language across the world.
        </p>
        <p>
          Prepare to dive deep into each episode, and dicover why Linguocast is the best platform around to learn a language by listening to podcasts.
        </p>
      </CollapsableInfo>
      <CollapsableInfo
        top="Why is Linguocast the right place for my podcast?"
      >
        <ol className="list-decimal ml-4 flex flex-col gap-2">
          <li>
            Visit the "Explore shows" tab (or <ForwardLink to="/explore" target="_blank">click here</ForwardLink>).
          </li>
          <li>
            Select the language you are studying and your current level.
          </li>
          <li>
            Browse the shows and click the ones that catch your eye.
          </li>
          <li>
            Click on "<RepeatIcon className="inline" size={16} /> Follow" button to never miss-out new epsiodes and comments.
          </li>
        </ol>
      </CollapsableInfo>
      <CollapsableInfo
        top="How much does it cost to list or host a podcast?"
      >
        Linguocast is completely free for creators, from beginning to end.
        If you host your podcast with us, the only heads up is that a 5 seconds Linguocast advertising is added to the end of your audio (to encourage listeners to come listen to Linguocast next time).
      </CollapsableInfo>
      <CollapsableInfo
        top="How much can I earn from my podcast? "
      >
        <ol className="list-decimal ml-4 flex flex-col gap-2">
          <li>
            Visit the "Vocabulary Corner" tab (or <ForwardLink to="/vocabulary" target="_blank">click here</ForwardLink>).
          </li>
          <li>
            If you have words to review click on the "<BookOpenCheckIcon className="inline" size={18} /> Review" button.
          </li>
          <li>
            The word, pronunciation (for language that apply) or translations will be masked. Try to recall it. You can optionally press the "<BrushIcon className="inline" size={16} />" at the bottom right corner to write down your answer. Press "<Maximize2Icon className="inline" size={12} /> Revele" to show the word.
          </li>
          <li>
            Select how difficult was to recall the word ("easy", "medium" or "hard"). The spaced repetition algorithm (check <ForwardLink to="https://en.wikipedia.org/wiki/Spaced_repetition" target="_blank">this Wikipedia article</ForwardLink> to know more) will rescheduled based on your response.
          </li>
          <li>Don't forget to check everyday for new words to review!</li>
        </ol>
      </CollapsableInfo>
      <CollapsableInfo
        top="How do I add my existing podcast from a RSS Feed"
      >
        <p className="mb-4">
          There is a <b>annual subscription, at $119.88 ($9.99/month) and a monthly subscription at $12.5/month</b>.
          Both types of memberships have a free initial week in which you can cancel anytime.
          The payments are securely processed by Stripe, we don't process nor store any credit card information.
        </p>
        <p>
          To check the benefits of Lingucast premium visit <ForwardLink to="/premium" target="_blank">the Linguocast Premium page</ForwardLink>.
        </p>
      </CollapsableInfo>
      <CollapsableInfo
        top="If I host my podcast in Linguocast, can I list it in another podcast platforms like Spotify or Apple Podcast?"
      >
        <p className="mb-4">
          There is a <b>annual subscription, at $119.88 ($9.99/month) and a monthly subscription at $12.5/month</b>.
          Both types of memberships have a free initial week in which you can cancel anytime.
          The payments are securely processed by Stripe, we don't process nor store any credit card information.
        </p>
        <p>
          To check the benefits of Lingucast premium visit <ForwardLink to="/premium" target="_blank">the Linguocast Premium page</ForwardLink>.
        </p>
      </CollapsableInfo>
      <CollapsableInfo
        top="How do I create a brand new podcast and host it in Linguocast?"
      >
        <p className="mb-4">
          There is a <b>annual subscription, at $119.88 ($9.99/month) and a monthly subscription at $12.5/month</b>.
          Both types of memberships have a free initial week in which you can cancel anytime.
          The payments are securely processed by Stripe, we don't process nor store any credit card information.
        </p>
        <p>
          To check the benefits of Lingucast premium visit <ForwardLink to="/premium" target="_blank">the Linguocast Premium page</ForwardLink>.
        </p>
      </CollapsableInfo>
      <CollapsableInfo
        top="Can I migrate my podcast from another podcast hosting platform?"
      >
        <p className="mb-4">
          There is a <b>annual subscription, at $119.88 ($9.99/month) and a monthly subscription at $12.5/month</b>.
          Both types of memberships have a free initial week in which you can cancel anytime.
          The payments are securely processed by Stripe, we don't process nor store any credit card information.
        </p>
        <p>
          To check the benefits of Lingucast premium visit <ForwardLink to="/premium" target="_blank">the Linguocast Premium page</ForwardLink>.
        </p>
      </CollapsableInfo>
      <CollapsableInfo
        top="How do I provide a transcript?"
      >
        <p className="mb-4">
          As a learner, you cannot directly add shows, but you can <b>suggest missing shows</b> at the "Explore shows" tab (<ForwardLink to="/explore" target="_blank">click here</ForwardLink>) and click on "Add show" and then "Suggest missing show".
          There you just need to feel some basic information about the language learning podcast and we take it from there.
        </p>
        <p className="mb-4">
          We'll start by getting in touch with the podcast creator to onboard they into the platform.
        </p>
        <p>
          If you are the owner of the podcast, visit <ForwardLink to="/creators" target="_blank">Linguocast creators</ForwardLink> to get started.
        </p>
      </CollapsableInfo>
      <CollapsableInfo
        top="How are the exercises?"
      >
        <p className="mb-4">
          There is a <b>annual subscription, at $119.88 ($9.99/month) and a monthly subscription at $12.5/month</b>.
          Both types of memberships have a free initial week in which you can cancel anytime.
          The payments are securely processed by Stripe, we don't process nor store any credit card information.
        </p>
        <p>
          To check the benefits of Lingucast premium visit <ForwardLink to="/premium" target="_blank">the Linguocast Premium page</ForwardLink>.
        </p>
      </CollapsableInfo>
      <CollapsableInfo
        top="What are embeddeds?"
      >
        <p className="mb-4">
          At least of <b>50% of your what you pay</b> for your memership is directly <b>distributed between the podcast creators that you listen</b>.
          This will support them financialy and keep them motivated to continue creating the awesome content you love.
        </p>
        <p>
          The rest of it goes to mantain Linguocast and continue crafting the best learning experience for you.
        </p>
      </CollapsableInfo>
      <CollapsableInfo
        top="How do I connect with my audience?"
      >
        <p className="mb-4">
          We invite you to <b>join Learner's Discord channel</b> to have a conversation with us! Click <ForwardLink to="https://discord.gg/p74Bzxng" target="_blank">on this link</ForwardLink> to join. You can also contact us through email at <ForwardLink to="mailto:hey@linguocast.com" target="_blank">hey@linguocast.com</ForwardLink>.
        </p>
        <p>
          We would love to hear your doubts, comments and feedback! 
        </p>
      </CollapsableInfo>
      <CollapsableInfo
        top="Can I list more than one podcast?"
      >
        <p className="mb-4">
          We invite you to <b>join Learner's Discord channel</b> to have a conversation with us! Click <ForwardLink to="https://discord.gg/p74Bzxng" target="_blank">on this link</ForwardLink> to join. You can also contact us through email at <ForwardLink to="mailto:hey@linguocast.com" target="_blank">hey@linguocast.com</ForwardLink>.
        </p>
        <p>
          We would love to hear your doubts, comments and feedback! 
        </p>
      </CollapsableInfo>
      <CollapsableInfo
        top="How can I contact Linguocast staff?"
      >
        <p className="mb-4">
          We invite you to <b>join Creators's Discord channel</b> to have a direct conversation with us and other fellow content-creators! Click <ForwardLink to="https://discord.gg/p74Bzxng" target="_blank">on this link</ForwardLink> to join. You can also shoot us an email at <ForwardLink to="mailto:creators@linguocast.com" target="_blank">creators@linguocast.com</ForwardLink>.
        </p>
        <p>
          We would love to hear your doubts, comments and feedback! 
        </p>
      </CollapsableInfo>
    </div>
  </div>
)
