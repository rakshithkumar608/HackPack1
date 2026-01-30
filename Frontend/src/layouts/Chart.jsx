import React, { useEffect, useRef } from "react";
import {
  createChart,
  AreaSeries,
  HistogramSeries,
  ColorType,
} from "lightweight-charts";

const defaultAreaData = [
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

const defaultHistogramData = [
  { value: 1, time: 1642425322 },
  { value: 8, time: 1642511722 },
  { value: 10, time: 1642598122 },
  { value: 20, time: 1642684522 },
  { value: 3, time: 1642770922, color: "red" },
  { value: 43, time: 1642857322 },
  { value: 41, time: 1642943722, color: "red" },
  { value: 43, time: 1643030122 },
  { value: 56, time: 1643116522 },
  { value: 46, time: 1643202922, color: "red" },
];

const Chart = ({
  areaData = defaultAreaData,
  histogramData = defaultHistogramData,
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: "#0b0e14" },
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

    // Area Series
    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: "#2962FF",
      topColor: "rgba(41, 98, 255, 0.3)",
      bottomColor: "rgba(41, 98, 255, 0)",
      lineWidth: 2,
    });
    areaSeries.setData(areaData);

    // Histogram Series (overlaid)
    const histogramSeries = chart.addSeries(HistogramSeries, {
      color: "#26a69a",
    });
    histogramSeries.setData(histogramData);

    chart.timeScale().fitContent();

    // Handle Responsive Resizing
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
      chart.remove();
    };
  }, [areaData, histogramData]);

  return (
    <div className="w-full h-full relative">
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ minHeight: "400px" }}
      />
    </div>
  );
};

export default Chart;
