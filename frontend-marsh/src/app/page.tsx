"use client";

import SearchBar from "@/components/SearchBar";
import { BackgroundLines } from "@/components/ui/background-lines";
import Logs from "@/components/Logs";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [projectSlug, setProjectSlug] = useState<string | null>(null);
  const [projectURL, setProjectURL] = useState<string | null>(null);
  const logsSectionRef = useRef<HTMLDivElement>(null);

  const handleProjectSubmit = (slug: string, URL: string) => {
    setProjectSlug(slug);
    setProjectURL(URL);
  };

  useEffect(() => {
    if (projectSlug && logsSectionRef.current) {
      logsSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [projectSlug, projectURL]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-center items-center h-screen">
        <BackgroundLines className="flex justify-center items-center">
          <SearchBar onProjectSubmit={handleProjectSubmit} />
        </BackgroundLines>
      </div>
      {projectSlug && (
        <div
          ref={logsSectionRef}
          className="flex-grow bg-white dark:bg-black py-12"
        >
          <h1 className="flex font-bold  text-3xl justify-center">
            {" "}
            Deployment Details
          </h1>
          <Logs projectSlug={projectSlug} />
          {projectURL && (
            <div className="mt-8 flex justify-center">
              <a
                href={projectURL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 font-mono bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <span className="text-white text-xl font-semibold">
                  ProjectURL:
                </span>
                <span className="px-3 py-1 bg-white/90 rounded text-xl text-gray-800">
                  {projectURL}
                </span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
