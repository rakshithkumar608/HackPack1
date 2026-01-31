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
            onClick={() => navigate("/register")}
            className="flex-none space-y-5 max-w-xl"
          >
            <a
              href=""
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
              src="https://img.freepik.com/free-vector/hand-drawn-flat-design-metaverse-background_52683-80690.jpg?semt=ais_hybrid&w=740&q=80"
              alt="Landing Illustration"
            />
          </div>
        </div>
      </section>

      {/* Three Info Cards Section */}
      <section className="bg-gradient-to-r from-purple-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to master trading
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Virtual Money
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Practice trading with unlimited virtual money. No deposits
                needed to get started learning the basics.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Real-time Data
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Access live market data and trending stocks. Make informed
                decisions based on real-time market information.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <div className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5.36 5.36l-.707.707M9 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Learn & Practice
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Gain practical experience with educational resources. Build your
                trading skills without financial risk.
              </p>
            </div>
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
              src="https://play-lh.googleusercontent.com/m6qMtEfuWKK2KlLFcWovURK7LwbD95Rgk5e8ipIh4Em4rkDecjqm64VlTA9HgSyMsEg=w240-h480-rw"
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
              src="https://www.omfif.org/wp-content/uploads/2022/07/trading-gamification-newweb.png"
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
              src="https://blog.vinfotech.com/sites/default/files/styles/blog-list-img-new/public/Gamification-to-stock-fantasy_0.png?itok=PYA3994o"
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
