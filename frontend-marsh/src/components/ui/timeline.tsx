"use client";

import {
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);

  // Update height whenever data changes
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const containerHeight =
          containerRef.current.getBoundingClientRect().height;
        setHeight(containerHeight + 150);
      }
    };

    updateHeight();
    // Add resize listener to update height if window size changes
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [data]);

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [data, autoScroll]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full bg-white dark:bg-neutral-950 font-sans relative">
      <div className="sticky top-0 z-50 w-full bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-black dark:text-white">
              Build Logs
            </h2>
            <p className="text-sm text-neutral-500">
              {data.length} log entries
            </p>
          </div>
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-3 py-1 text-sm rounded-full ${
              autoScroll
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
            }`}
          >
            Auto-scroll: {autoScroll ? "On" : "Off"}
          </button>
        </div>
      </div>

      <div ref={containerRef} className="relative max-w-7xl mx-auto pb-20">
        {/* Timeline line container */}
        <div
          ref={timelineRef}
          className="absolute left-8 md:left-8 top-0 bottom-0 w-[2px] z-0"
          style={{ height: height > 0 ? `${height}px` : "100%" }}
        >
          {/* Background line */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]" />

          {/* Animated line */}
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-full bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>

        {/* Timeline entries */}
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start pt-10 md:pt-24 md:gap-10 relative z-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <motion.div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2" />
              </motion.div>
              <h3 className="hidden md:block text-sm md:pl-20 font-mono text-neutral-500 dark:text-neutral-400">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-sm mb-4 text-left font-mono text-neutral-500 dark:text-neutral-400">
                {item.title}
              </h3>
              <div className="relative bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
                {item.content}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
