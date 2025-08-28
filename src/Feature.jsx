import React from 'react';
import {
  TrendingUp,
  Scale,
  Leaf,
  Heart,
  PiggyBank,
  Target
} from 'lucide-react';

const FeatureCard = ({ title, description, icon: Icon }) => (
  <div className="p-8 border border-gray-700/50 rounded-xl bg-gray-900/90 shadow-lg 
                  hover:shadow-2xl transition-all duration-500 hover:scale-102 
                  hover:border-green-500/30 group backdrop-blur-sm
                  relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
    <div className="relative z-10">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-green-900/30 rounded-xl group-hover:bg-green-900/50 
                        transition-all duration-500 ring-1 ring-green-500/20
                        group-hover:ring-green-500/40">
          <Icon className="h-7 w-7 text-green-400 group-hover:text-green-300 
                          transform group-hover:rotate-6 transition-all duration-500" />
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-green-400 
                     transition-colors duration-500">
        {title}
      </h3>
      <p className="text-gray-400 group-hover:text-gray-200 transition-colors duration-500 
                    leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

const FeaturesSection = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "Growing Popularity of ESG Investing",
      description: "Learn how ESG investing has become mainstream, with increasing numbers of investors prioritizing environmental, social, and governance factors in their investment decisions."
    },
    {
      icon: Scale,
      title: "ESG vs. Traditional Investing",
      description: "Understand the key differences between ESG and traditional investing approaches, and how sustainable investing can potentially offer better risk-adjusted returns."
    },
    {
      icon: Leaf,
      title: "Reducing Environmental Risks",
      description: "Discover how ESG-focused investments help minimize exposure to environmental risks and support companies leading the transition to a sustainable economy."
    },
    {
      icon: Heart,
      title: "Consumer and Employee Well-being",
      description: "Explore investments in companies that prioritize stakeholder well-being, fostering better workplace conditions and consumer satisfaction."
    },
    {
      icon: PiggyBank,
      title: "Sustainable & Profitable Investing",
      description: "See how sustainable investing can generate competitive returns while contributing to positive environmental and social impact."
    },
    {
      icon: Target,
      title: "Aligning Investments with Values",
      description: "Match your investment strategy with your personal values while building a diversified portfolio that supports sustainable business practices."
    }
  ];

  return (
    <section className="relative w-full bg-gray-800 overflow-hidden mt-24 md:mt-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#1a472a,#111827_60%)]"/>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-xl sm:text-4xl md:text-5xl font-bold text-white mb-4 
                         bg-gradient-to-r from-green-400 via-green-300 to-green-500 
                         bg-clip-text 
                         [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]">
            Why Choose ESG Investing?
          </h2>
          <p className="text-sm sm:text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto
                        font-light">
            Build a portfolio that delivers both financial returns and positive impact
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 
                        sm:gap-10 md:gap-12 lg:gap-12">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
