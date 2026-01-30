import React from "react";
import { Home, BellIcon, UserCircleIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import Sidebar from "../layouts/Sidebar";
import Chart from "../layouts/Chart";

const Dashboard = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* HEADER */}
      <header className="h-16 bg-white border-b flex items-center justify-between px-6">
        <span className="text-xl font-semibold">
          <span className="font-bold">Stock</span>
          <span className="text-blue-600 text-2xl font-bold">Learn</span>
        </span>

        <div className="flex items-center space-x-6 text-sm font-medium text-gray-700">
          <NavLink to="/">
            <Home size={18} />
          </NavLink>

          <NavLink to="#" className="hover:text-blue-600 transition">
            Watchlist
          </NavLink>
          <NavLink to="#" className="hover:text-blue-600 transition">
            Portfolio
          </NavLink>
          <NavLink to="#" className="hover:text-blue-600 transition">
            Orders
          </NavLink>

          <button className="relative">
            <BellIcon
              size={18}
              className="text-gray-600 hover:text-blue-600 transition"
            />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
          </button>

          <UserCircleIcon
            size={28}
            className="text-gray-600 hover:text-blue-600 cursor-pointer transition"
          />
        </div>
      </header>

      {/* BODY */}
      <div className="flex flex-1 bg-gray-100">
        <Sidebar />

        <main className="flex-1 flex flex-col">
          {/* TOP BAR INSIDE MAIN */}
          <div className="h-14 px-6 flex items-center justify-between border-b bg-white">
            <h1 className="text-lg font-semibold text-gray-700">
              Market Overview
            </h1>

            <div className="flex gap-3">
              <button className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-semibold">
                Buy
              </button>
              <button className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-semibold">
                Sell
              </button>
            </div>
          </div>

          {/* CHART AREA */}
          <div className="flex-1 p-4">
            <Chart />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
