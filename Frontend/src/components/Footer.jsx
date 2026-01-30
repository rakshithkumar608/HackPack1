import React, { useRef, useState } from "react";

/* Single FAQ Item */
const FaqItem = ({ faq }) => {
  const answerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState("0px");

  const toggleAnswer = () => {
    const contentHeight = answerRef.current.scrollHeight;
    setOpen(!open);
    setHeight(open ? "0px" : `${contentHeight}px`);
  };

  return (
    <div
      className="mt-5 overflow-hidden border-b cursor-pointer"
      onClick={toggleAnswer}
    >
      <div className="flex items-center justify-between py-5 text-lg font-medium text-gray-700">
        {faq.q}
        {open ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 12H4"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        )}
      </div>

      <div
        ref={answerRef}
        style={{ height }}
        className="transition-all duration-300 overflow-hidden"
      >
        <p className="pb-5 text-gray-500">{faq.a}</p>
      </div>
    </div>
  );
};

/* FAQ Section */
const Footer = () => {
  const faqsList = [
    {
      q: "What is virtual trading?",
      a: "Virtual trading allows you to practice buying and selling assets using simulated money without any real financial risk.",
    },
    {
      q: "Do I need to deposit real money?",
      a: "No deposit is required. You can practice trading with virtual funds only.",
    },
    {
      q: "Is this suitable for beginners?",
      a: "Yes, the platform is designed for beginners as well as experienced traders.",
    },
    {
      q: "Can I trade crypto and stocks?",
      a: "Yes, you can practice trading stocks, cryptocurrencies, and more.",
    },
    {
      q: "Is this platform free?",
      a: "Yes, the simulator is completely free to use.",
    },
  ];

  return (
    <>
      {/* FAQ CONTENT */}
      <section className="max-w-7xl mx-auto px-4 mt-20 md:px-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-semibold text-gray-800">
            Frequently Asked Questions
          </h2>
          <p className="max-w-lg mx-auto text-lg text-gray-600">
            Find answers to common questions. Still confused? Feel free to
            contact us.
          </p>
        </div>

        <div className="mt-14 max-w-2xl mx-auto">
          {faqsList.map((faq, index) => (
            <FaqItem key={index} faq={faq} />
          ))}
        </div>
      </section>

      {/* FULL-WIDTH FOOTER */}
      <footer className="w-full bg-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-300">
            © 2024 Virtual Trading Simulator. All rights reserved.
            <span className="mx-3 text-gray-500">|</span>
            <a href="#" className="hover:text-white transition">
              Terms of Use
            </a>
            <span className="mx-3 text-gray-500">|</span>
            <a href="#" className="hover:text-white transition">
              Privacy Policy
            </a>
            <span className="mx-3 text-gray-500">|</span>
            <a href="#" className="hover:text-white transition">
              Help Center
            </a>
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
