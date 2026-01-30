import React from "react";
import { Home, BellIcon, UserCircleIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import Sidebar from "../../layouts/Sidebar";

const Dashboard = () => {
  return (
    <div className="h-screen flex flex-col">
      <header className="h-16 bg-white border-b flex items-center justify-between px-6">
        <span className="text-xl font-semibold">
          <span className="font-bold">Stock</span>
          <span className="text-blue-600 text-2xl font-bold">Learn</span>
        </span>

        <div className="flex items-center space-x-6 text-sm font-medium text-gray-700">
          <Home size={18} />

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
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          <UserCircleIcon
            size={28}
            className="text-gray-600 hover:text-blue-600 cursor-pointer transition"
          />
        </div>
      </header>

      <div className="flex flex-1 bg-gray-100">
        <Sidebar className="hidden md:block" />

        <main className="flex-1 p-6">
          <h1 className="text-xl font-semibold text-gray-700">
            Market Overview
          </h1>
          {/* main content goes here */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
