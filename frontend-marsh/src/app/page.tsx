"use client"
import SearchBar from "@/components/SearchBar";
import { BackgroundLines } from "@/components/ui/background-lines";
import Logs from "@/components/Logs";
import { useState } from "react";

export default function Home() {
  const [projectSlug, setProjectSlug] = useState<string | null>(null);

  const handleProjectSubmit = (slug: string) => {
    setProjectSlug(slug);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-center items-center h-screen">
        <BackgroundLines className="flex justify-center items-center">
          <SearchBar onProjectSubmit={handleProjectSubmit} />
        </BackgroundLines>
      </div>
      {projectSlug && (
        <div className="flex-grow bg-white dark:bg-black py-12">
          <Logs projectSlug={projectSlug} />
        </div>
      )}
    </div>
  );
}