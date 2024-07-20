import { useState } from "react";

import { CheckIcon, StarIcon, XIcon } from "lucide-react";
import { Card } from "@/ui/card.ui";
import { Switch } from "@/ui/switch.ui";
import { Button } from "@/ui/button.ui";

const Premium = () => {
  const [isAnnualPayment, setIsAnnualPayment] = useState(true);

  const features = [
    { name: "Listen to episodes", free: "Unlimited", premium: "Unlimited" },
    { name: "Support for creators", free: "No support", premium: "From our shared revenue pool" },
    { name: "Read along (transcript)", free: "The initial 1/3", premium: "Full access" },
    { name: "Exercises", free: "Up to 10 per day", premium: "No limit" },
    { name: "Save words", free: "Up to 12 per day", premium: "Unlimited" },
    { name: "Review words", free: "Unlimited", premium: "Unlimited" },
    { name: "Request missing transcripts + exercises", free: "No request", premium: "Up to 20 transcripts + exercises per month" },
  ]

  const reviews = [
    {
      name: "Sarah L.",
      review: "The synchronized transcript feature is a game-changer! I can follow along with the audio, improving my listening and reading skills simultaneously. It's like having subtitles for podcasts!",
      feature: "Read along (synchronized transcript)",
    },
    {
      name: "Michael T.",
      review: "Being able to save and revise 'catch' words has dramatically expanded my vocabulary. I love how I can quickly mark words during listening and review them later. It's made learning new terms so much more efficient!",
      feature: "Save words and revise later",
    },
    {
      name: "Elena R.",
      review: "The exercises after each podcast are fantastic for reinforcing what I've learned. They help me evaluate my understanding and really solidify the new language concepts. My comprehension has improved significantly!",
      feature: "Exercises for understanding",
    }
  ]

  return (
    <div className="container py-8 md:py-16">
      <div className="mb-16">
        <div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl mb-6">Elevate Your Learning with Linguocast Premium</h1>
          <p className="text-lg my-4">
            Your Premium subscription financially supports top content creators while unlocking you powerful learning tools.
          </p>
        </div>
          <div>
            <div className="flex items-center space-x-4 mb-6">
              <span className={`text-lg ${!isAnnualPayment && 'font-bold'}`}>Monthly</span>
              <Switch
                checked={isAnnualPayment}
                onChange={setIsAnnualPayment}
              />
              <span className={`text-lg ${isAnnualPayment && 'font-bold'}`}>Annually (Save 35%)</span>
            </div>
            <div className="mb-4">
              <span className="text-4xl font-bold">${isAnnualPayment ? '9.99' : '13.50'}</span>
              <span className="text-xl">/month</span>
            </div>
            <Button className="mt-4 py-3 rounded-lg text-lg font-semibold">
              Start Your 7-Day Free Trial
            </Button>
            <p className="text-sm mt-2">Cancel anytime before the trial ends - no charge.</p>
          </div>
      </div>
      

      <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Free</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premium</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {features.map((feature, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{feature.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {feature.free === "Unlimited" ? (
                  <CheckIcon className="w-5 h-5 text-green-500" />
                ) : feature.free === "No support" || feature.free === "No request" ? (
                  <XIcon className="w-5 h-5 text-red-500" />
                ) : (
                  feature.free
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                {feature.premium === "Unlimited" || feature.premium.includes("Full") ? (
                  <CheckIcon className="w-5 h-5 text-green-500" />
                ) : (
                  feature.premium
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>

        <h2 className="text-3xl mb-6 text-center mt-12">What Our Users Say</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {reviews.map((review, index) => (
          <Card key={index}>
            <div className="flex items-center mb-4">
              <img 
                src={`/api/placeholder/60/60`} 
                alt={`${review.name}'s avatar`} 
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h3 className="font-semibold">{review.name}</h3>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 fill-current text-yellow-500" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-2">{review.review}</p>
            <p className="text-sm font-medium text-green-600">{review.feature}</p>
          </Card>
        ))}
      </div>

      {/* Final CTA */}
      <div className="text-center mt-12">
        <Button>
          Start Your 7-Day Free Trial Now
        </Button>
        <p className="mt-2 text-sm text-gray-600">Risk-free trial. Cancel anytime.</p>
      </div>
    </div>
  );
};

export default Premium;