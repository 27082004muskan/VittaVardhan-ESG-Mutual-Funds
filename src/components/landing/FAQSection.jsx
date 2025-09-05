import  { useState } from "react";
import { HiMail } from 'react-icons/hi';

const faqData = [
  {
    id: 1,
    question: "What are ESG funds, and how do they work?",
    answer:
      "ESG funds invest in companies that meet environmental, social, and governance standards, ensuring responsible and sustainable business practices while generating financial returns.",
  },
  {
    id: 2,
    question: "Are ESG funds as profitable as traditional investments?",
    answer:
      "Yes, many ESG funds have shown competitive or even higher returns than traditional investments due to strong governance, ethical practices, and resilience against economic risks.",
  },
  {
    id: 3,
    question: "How can ESG funds benefit the environment and society?",
    answer:
      "ESG funds support businesses that reduce carbon footprints, promote fair labor policies, and follow ethical corporate governance, contributing to a more sustainable future.",
  },
  {
    id: 4,
    question: "Are ESG investments regulated or government-supported?",
    answer:
      "Yes, many governments encourage ESG investing through policies, tax benefits, and regulations to promote sustainability and responsible investing.",
  },
  {
    id: 5,
    question: "How can I start investing in ESG funds?",
    answer:
      "You can invest in ESG mutual funds, ETFs, or green bonds through financial institutions, stock markets, or investment platforms that offer ESG-focused portfolios.",
  },
];

// eslint-disable-next-line react/prop-types
const FAQItem = ({ question, answer, isOpen, toggle }) => (
  <div className="border border-gray-600 rounded-lg hover:border-green-500/50 
                  transition-all duration-300 group">
    <button
      className="w-full text-left p-4 bg-gray-900 hover:bg-gray-800 
                 transition-all duration-300 flex justify-between items-center 
                 rounded-lg group-hover:text-green-400"
      onClick={toggle}
    >
      <span className="font-semibold text-lg text-white">{question}</span>
      <span className="text-white text-xl font-bold transition-transform duration-300 
                       transform group-hover:scale-110 group-hover:text-green-400">
        {isOpen ? "−" : "+"}
      </span>
    </button>
    {isOpen && (
      <div className="overflow-hidden transition-all duration-300">
        <p className="p-4 text-gray-300 border-t border-gray-700 bg-gray-900/50 
                      leading-relaxed">
          {answer}
        </p>
      </div>
    )}
  </div>
);

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <>
      {/* FAQ Section */}
      <section className="py-20 bg-gray-900 text-gray-100">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 
                           bg-gradient-to-r from-green-400 to-green-600 
                           bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-300 text-lg">
              Everything you need to know about green investments
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq) => (
              <FAQItem
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === faq.id}
                toggle={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="w-full py-20 bg-gray-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-gray-800 rounded-2xl p-8 md:p-12 border border-gray-700 
                         hover:border-green-500/50 transition-all duration-300">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 
                            bg-gradient-to-r from-green-400 to-green-600 
                            bg-clip-text text-transparent">
                Stay Updated
              </h2>
              <p className="text-gray-300">Get the latest insights on sustainable investing directly in your inbox.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 rounded-lg bg-gray-300 border border-gray-700 
                           focus:outline-none focus:border-green-500 transition-all duration-300"
              />
              <button className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg 
                                font-semibold transition-all duration-300 flex items-center 
                                justify-center gap-2 hover:shadow-lg hover:shadow-green-500/20">
                Subscribe
                <HiMail className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQSection;
