import React from "react";
import { CheckCircle2 } from "lucide-react";

// Pricing Card Component
function PricingCard({
  title,
  price,
  features,
  backgroundColor,
  highlightColor,
  recommended = false,
}) {
  return (
    <div
      className={`
      relative 
      bg-white/10 
      backdrop-blur-md 
      border 
      border-white/20 
      rounded-2xl 
      p-6 
      transform 
      transition-all 
      duration-300 
      hover:scale-105 
      hover:shadow-2xl
      ${recommended ? "ring-4 ring-indigo-500/50" : ""}
    `}
    >
      {recommended && (
        <div className="absolute top-0 right-0 m-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs">
          Recommended
        </div>
      )}

      <div className="space-y-4">
        <h3
          className="text-2xl font-bold text-white"
          style={{ color: highlightColor }}
        >
          {title}
        </h3>

        <div className="flex items-center space-x-2">
          <span className="text-4xl font-extrabold text-white">${price}</span>
          <span className="text-gray-400">/month</span>
        </div>

        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center space-x-2 text-gray-300"
            >
              <CheckCircle2 size={20} className="text-indigo-400" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <button
          className={`
            w-full 
            py-3 
            rounded-lg 
            font-bold 
            transition 
            duration-300 
            hover:scale-105
            ${
              recommended
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "border border-white/30 text-white hover:bg-white/10"
            }
          `}
        >
          Choose {title}
        </button>
      </div>
    </div>
  );
}

// Pricing Section Component
function PricingSection() {
  const pricingTiers = [
    {
      title: "Starter",
      price: 10,
      features: [
        "Generate upto 5 reports per month",
        "Basic data processing",
        "Access to community support",
      ],
      backgroundColor: "bg-purple-900/30",
      highlightColor: "#8B5CF6",
    },
    {
      title: "Pro",
      price: 30,
      features: [
        "Generate upto 50 reports per month",
        "Advanced data processing",
        "Priority Support",
        "Customizable templates",
      ],
      backgroundColor: "bg-indigo-900/30",
      highlightColor: "#6366F1",
      recommended: true,
    },
    {
      title: "Premium",
      price: 100,
      features: [
        "Unlimited Reports",
        "AI driven insights",
        "Dedicated account manager",
        "Advanced customization",
        "24/7 premium support",
      ],
      backgroundColor: "bg-blue-900/30",
      highlightColor: "#3B82F6",
    },
  ];

  return (
    <section className="relative py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-extrabold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-600"
            style={{ lineHeight: 2 }}
          >
            Pricing Plans
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose the perfect plan that scales with your business intelligence
            needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <PricingCard
              key={index}
              title={tier.title}
              price={tier.price}
              features={tier.features}
              backgroundColor={tier.backgroundColor}
              highlightColor={tier.highlightColor}
              recommended={tier.recommended}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
