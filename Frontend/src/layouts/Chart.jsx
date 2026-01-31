import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { createChart, AreaSeries, ColorType } from "lightweight-charts";

const Chart = forwardRef(({ data = [] }, ref) => {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const lastTimeRef = useRef(0);
  const lastValueRef = useRef(0);

  // Initialize chart ONCE
  useEffect(() => {
    if (!containerRef.current) return;

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
        leftOffset: 0,
      },
    });

    chartRef.current = chart;

    // Create AreaSeries ONCE
    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: "#2962FF",
      topColor: "rgba(41, 98, 255, 0.3)",
      bottomColor: "rgba(41, 98, 255, 0)",
      lineWidth: 2,
    });

    seriesRef.current = areaSeries;

    // Set initial data if provided
    if (data && data.length > 0) {
      areaSeries.setData(data);
      lastTimeRef.current = data[data.length - 1]?.time || 0;
      lastValueRef.current = data[data.length - 1]?.value || 0;

      // Position first point at left corner
      chart.timeScale().fitContent();
      const firstTime = data[0]?.time;
      if (firstTime) {
        setTimeout(() => {
          chart.timeScale().scrollToPosition(-5, false);
        }, 10);
      }
    }

    // Handle Responsive Resizing
    const handleResize = () => {
      if (containerRef.current && chart) {
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
  }, [data]);

  // Expose updatePrice and getCurrentPrice methods via forwardRef
  useImperativeHandle(ref, () => ({
    addPrice: ({ time, value }) => {
      if (!seriesRef.current || !chartRef.current) return;

      // Ensure time is strictly increasing
      if (time <= lastTimeRef.current) {
        console.warn(`⚠️ Time must increase. Got ${time}, last ${lastTimeRef.current}`);
        return;
      }

      lastTimeRef.current = time;
      lastValueRef.current = value;

      // Update with new data point
      seriesRef.current.update({
        time,
        value,
      });

      // Scroll to latest
      chartRef.current.timeScale().scrollToPosition(2, false);
    },
    getCurrentPrice: () => {
      return lastValueRef.current;
    },
  }));

  return (
    <div className="w-full h-full relative">
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ minHeight: "400px" }}
      />
    </div>
  );
});

Chart.displayName = "Chart";
export default Chart;
