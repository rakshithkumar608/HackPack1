import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Background Blur Gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-150 blur-3xl -z-10"
        style={{
          background:
            "linear-gradient(143.6deg, rgba(192,132,252,0.3) 20.79%, rgba(232,121,249,0.35) 40.92%, rgba(204,171,238,0.3) 70.35%)",
        }}
      />

      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-6 py-28 gap-12 text-gray-600 md:flex md:px-8">
          {/* Left */}
          <div
            onClick={() => navigate("/dashboard")}
            className="flex-none space-y-5 max-w-xl"
          >
            <a
              href="#"
              className="inline-flex gap-x-4 items-center rounded-full p-1 pr-5 border text-sm font-medium hover:bg-white transition"
            >
              <span className="rounded-full px-3 py-1 bg-indigo-600 text-white">
                News
              </span>
              <span className="flex items-center gap-1">
                Start your trading journey today
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </a>

            <h1 className="text-4xl font-extrabold text-gray-800 sm:text-5xl">
              Learn Trading with Virtual Money
            </h1>

            <p className="text-lg leading-relaxed">
              Practice trading stocks, cryptos & options with virtual money.
              Gain confidence before risking real capital in live markets.
            </p>
          </div>

          {/* Right Image */}
          <div className="flex-1 hidden md:flex justify-center">
            <img
              src="https://raw.githubusercontent.com/sidiDev/remote-assets/c86a7ae02ac188442548f510b5393c04140515d7/undraw_progressive_app_m-9-ms_oftfv5.svg"
              className="max-w-xl"
              alt="Trading illustration"
            />
          </div>
        </div>
      </section>

      {/* Practice Section */}
      <section className="bg-blue-100">
        <div className="max-w-7xl mx-auto flex  items-center justify-between px-10 py-20 max-lg:flex-col max-lg:text-center">
          {/* Left Content */}
          <div className="w-1/2 max-lg:w-full">
            <h2 className="mb-6 text-5xl font-semibold text-blue-900 max-lg:text-4xl">
              Practice stock trading with virtual money.
            </h2>

            <p className="max-w-xl text-lg leading-relaxed text-gray-700 max-lg:mx-auto">
              No deposit needed. Practice trading with virtual money to sharpen
              your understanding of the stock market and online brokerages.
            </p>
          </div>

          {/* Right Image */}
          <div className="flex w-1/2 justify-center max-lg:mt-12 max-lg:w-full">
            <img
              src="/phone-illustration.png"
              alt="Stock trading illustration"
              className="w-105 max-w-full"
            />
          </div>
        </div>
      </section>

      {/* left section  */}
      <section className="bg-gray-100">
        <div className="max-w-7xl mx-auto flex  items-center justify-between px-10 py-20 max-lg:flex-col max-lg:text-center">
          {/* Right Image */}
          <div className="flex w-1/2 justify-center max-lg:mt-12 max-lg:w-full">
            <img
              src="/phone-illustration.png"
              alt="Stock trading illustration"
              className="w-105 max-w-full"
            />
          </div>
          {/* Left Content */}
          <div className="w-1/2 max-lg:w-full">
            <h2 className="mb-6 text-5xl font-semibold text-blue-900 max-lg:text-4xl">
              Practice stock trading with virtual money.
            </h2>

            <p className="max-w-xl text-lg leading-relaxed text-gray-700 max-lg:mx-auto">
              No deposit needed. Practice trading with virtual money to sharpen
              your understanding of the stock market and online brokerages.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-blue-100">
        <div className="max-w-7xl mx-auto flex  items-center justify-between px-10 py-20 max-lg:flex-col max-lg:text-center">
          {/* Left Content */}
          <div className="w-1/2 max-lg:w-full">
            <h2 className="mb-6 text-5xl font-semibold text-blue-900 max-lg:text-4xl">
              Practice stock trading with virtual money.
            </h2>

            <p className="max-w-xl text-lg leading-relaxed text-gray-700 max-lg:mx-auto">
              No deposit needed. Practice trading with virtual money to sharpen
              your understanding of the stock market and online brokerages.
            </p>
          </div>

          {/* Right Image */}
          <div className="flex w-1/2 justify-center max-lg:mt-12 max-lg:w-full">
            <img
              src="/phone-illustration.png"
              alt="Stock trading illustration"
              className="w-105 max-w-full"
            />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default LandingPage;
