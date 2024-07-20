import { ForwardLink } from "@/ui/forward-link.ui"

import { usePageTitle } from "@/utils/document.utils"
import { CollapsableInfo } from "@/ui/collapsable-info.ui"
import { BookOpenCheckIcon, BrushIcon, InfoIcon, Maximize2Icon } from "lucide-react"

const About = () => {
  usePageTitle('About')
  return (
    <div className="container">
      <h1 className="text-3xl mb-8 mt-8">FAQ</h1>
      <div className='space-y-8 md:space-y-8'>
        <CollapsableInfo
          top="What is Linguocast?"
        >
          <p className="mb-4">
            We are the podcast platform tailored to language learners.
            Our mission is to turn every podcast episode into an engaging and effective language lesson.
            We partner with awesome content creators to distribute their language learning content in a more impactful way.
          </p>
          <p>
            Prepare to dive deep into each episode, and dicover why Linguocast is the best platform to learn a language.
          </p>
        </CollapsableInfo>
        <CollapsableInfo
          top="How do I find new shows to listen?"
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
              Click on "Follow" button to never miss-out new epsiodes and comments.
            </li>
          </ol>
        </CollapsableInfo>
        <CollapsableInfo
          top="How do I grab new words?"
        >
          <ol className="list-decimal ml-4 flex flex-col gap-2">
            <li>
              Start by listening episodes with transcript.
              <div className="border-[1px] p-4 rounded-md text-sm flex gap-4 items-center mt-2">
                <InfoIcon  size={16} className="flex-shrink-0" />
                If the episode doesn't have a transcript, you can request it with a Linguocast Premium account.
              </div>
            </li>
            <li>
              Press on "Play", and while listening the epsiode, maximize the player touching on the bottom player bar.
            </li>
            <li>
              Click on the challenging words, and the info will show in the screen.
            </li>
            <li>
              Click on "grab" to add it to your vocabulary corner.
            </li>
          </ol>
        </CollapsableInfo>
        <CollapsableInfo
          top="How do I review the words I grabbed?"
        >
          <ol className="list-decimal ml-4 flex flex-col gap-2">
            <li>
              Visit the Vocabulary corner tab (or <ForwardLink to="/vocabulary" target="_blank">click here</ForwardLink>).
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
          top="How do I add new shows?"
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
          top="How much is Linguocast Premium?"
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
          top="How much of my Linguocast Premium goes to the creators"
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
          top="How can I contact Linguocast?"
        >
          <p className="mb-4">
            We invite you to <b>join Learner's Discord channel</b> to have a conversation with us! Click <ForwardLink to="https://discord.gg/p74Bzxng" target="_blank">on this link</ForwardLink> to join. You can also contact us through email at <ForwardLink to="mailto:hey@linguocast.com" target="_blank">hey@linguocast.com</ForwardLink>.
          </p>
          <p>
            We would love to hear your doubts, comments and feedback! 
          </p>
        </CollapsableInfo>
      </div>
    </div>
  )
}

export default About
