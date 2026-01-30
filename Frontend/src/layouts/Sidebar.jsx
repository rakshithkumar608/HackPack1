import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ className = "" }) => {
  const stocks = [
    { name: "SUZLON", price: 47.67, change: 0.23, percent: 0.48 },
    { name: "NTPC", price: 356.0, change: -2.15, percent: -0.6 },
    { name: "IRFC", price: 120.1, change: 0.04, percent: 0.03 },
    { name: "TMPV", price: 350.05, change: -1.75, percent: -0.5 },
    { name: "NHPC", price: 78.2, change: -0.98, percent: -1.24 },
    { name: "ONGC", price: 268.96, change: -6.43, percent: -2.33 },
    { name: "IREDA", price: 132.08, change: -1.18, percent: -0.89 },
    { name: "RVNL", price: 343.4, change: 1.95, percent: 0.57 },
    { name: "IOC", price: 163.24, change: 0.15, percent: 0.09 },
  ];

  return (
    <aside
      className={`w-80 bg-white border-r h-full flex flex-col ${className}`}
    >
      {/* Search */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-2">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none text-sm w-full"
          />
          <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500 cursor-pointer" />
        </div>
      </div>

      {/* Stock List */}
      <div className="flex-1 overflow-y-auto">
        {stocks.map((stock, index) => {
          const isPositive = stock.change >= 0;

          return (
            <div
              key={index}
              className="flex justify-between items-center px-4 py-3 border-b hover:bg-gray-50 cursor-pointer"
            >
              <div>
                <p className="font-semibold text-sm text-gray-800">
                  {stock.name}
                </p>
                <p className="text-xs text-gray-500">{stock.price}</p>
              </div>

              <div className="text-right">
                <p
                  className={`font-semibold text-sm ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stock.price.toFixed(2)} {isPositive ? "▲" : "▼"}
                </p>
                <p
                  className={`text-xs ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {stock.change.toFixed(2)} ({stock.percent.toFixed(2)}%)
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom */}
      <div className="p-4 border-t text-blue-600 text-xs font-semibold flex justify-between items-center">
        OPTIONS QUICK LIST
        <span className="h-6 w-6 flex items-center justify-center rounded-full border text-blue-600">
          ❯
        </span>
      </div>
    </aside>
  );
};

export default Sidebar;
