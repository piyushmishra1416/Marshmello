"use client";

import React, { useEffect, useState } from "react";
import { Timeline } from "./ui/timeline";
import { io, Socket } from "socket.io-client";

interface LogEntry {
  timestamp: string;  // Adding timestamp to the structure
  message: string;
}

interface LogsProps {
  projectSlug: string;
}

const Logs: React.FC<LogsProps> = ({ projectSlug }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:9002");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      newSocket.emit("subscribe", `logs:${projectSlug}`);
    });

    let isFirstMessage = true; // Flag to track the first message

    newSocket.on("message", (message: string) => {
      console.log("Received message:", message);
    
      // Check if this is the first message
      if (isFirstMessage) {
        isFirstMessage = false; // Set the flag to false after the first message
        return; // Ignore the first message
      }

      try {
        const logEntry = JSON.parse(message); // Parse the incoming log message

        if (logEntry && logEntry.log) {
          // Create a new log entry with the current timestamp
          const newLog: LogEntry = {
            timestamp: new Date().toISOString(), // Use the current time as timestamp
            message: logEntry.log.trim(), // Remove leading/trailing whitespace
          };

          setLogs((prevLogs) => [...prevLogs, newLog]); // Add the new log entry to state
        } else {
          console.warn("Unexpected log format:", logEntry);
        }
      } catch (error) {
        console.error("Error parsing log message:", error);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [projectSlug]);

  const timelineData = logs.map((log, index) => ({
    title: new Date(log.timestamp).toLocaleTimeString(), // Use the timestamp for the title
    content: (
      <div key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {log.message}
        </p>
      </div>
    ),
  }));

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold mb-4">Deployment Details</h2>
      {logs.length > 0 ? (
        <Timeline data={timelineData} />
      ) : (
        <p className="text-center text-gray-500">Waiting for logs...</p>
      )}
    </div>
  );
};

export default Logs;
