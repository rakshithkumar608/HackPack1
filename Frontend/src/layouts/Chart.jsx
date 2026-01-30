import React, { useEffect, useRef } from "react";
import { createChart, AreaSeries, ColorType } from "lightweight-charts";

const defaultData = [
  { time: 1642425322, value: 0 },
  { time: 1642511722, value: 8 },
  { time: 1642598122, value: 10 },
  { time: 1642684522, value: 20 },
  { time: 1642770922, value: 3 },
  { time: 1642857322, value: 43 },
  { time: 1642943722, value: 41 },
  { time: 1643030122, value: 43 },
  { time: 1643116522, value: 56 },
  { time: 1643202922, value: 46 },
];

const Chart = ({ data = defaultData }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Initialize Chart with Watermark Hidden
  const chart = createChart(containerRef.current, {
    width: containerRef.current.clientWidth,
    height: containerRef.current.clientHeight,
    layout: {
      background: { type: ColorType.Solid, color: "#ffffff" },
      textColor: "#d1d4dc",
    },
    watermark: {
      visible: false,
    },
    grid: {
      vertLines: { color: "rgba(42, 46, 57, 0.5)" },
      horzLines: { color: "rgba(42, 46, 57, 0.5)" },
    },
    timeScale: {
      rightOffset: 5,
      barSpacing: 15,
      borderColor: "#2B2B43",
    },
  });

    // 2. ✅ v5 WAY (Ensures no "not a function" error)
    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: "#2962FF",
      topColor: "rgba(41, 98, 255, 0.3)",
      bottomColor: "rgba(41, 98, 255, 0)",
      lineWidth: 2,
    });

    areaSeries.setData(data);
    chart.timeScale().fitContent();

    // 3. Handle Responsive Resizing
    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove(); // Cleanup to prevent memory leaks
    };
  }, [data]);

  return (
    <div className="w-full h-full relative">
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ minHeight: "400px" }} // Ensures visibility
      />
    </div>
  );
};

export default Chart;
