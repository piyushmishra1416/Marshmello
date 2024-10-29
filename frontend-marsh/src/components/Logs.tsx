"use client";

import React, { useEffect, useState } from "react";
import { Timeline } from "./ui/timeline";
import { io, Socket } from "socket.io-client";

interface LogEntry {
  timestamp: string;
  message: string;
}

interface LogsProps {
  projectSlug: string;
}

// Function to determine log type based on message content
const determineLogType = (message: string) => {
  const lowerMsg = message.toLowerCase();
  if (
    lowerMsg.includes("error") ||
    lowerMsg.includes("failed") ||
    lowerMsg.includes("fatal")
  ) {
    return "error";
  }
  if (lowerMsg.includes("warning") || lowerMsg.includes("warn")) {
    return "warning";
  }
  if (
    lowerMsg.includes("success") ||
    lowerMsg.includes("completed") ||
    lowerMsg.includes("done")
  ) {
    return "success";
  }
  return "info";
};

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

    let isFirstMessage = true;

    newSocket.on("message", (message: string) => {
      if (isFirstMessage) {
        isFirstMessage = false;
        return;
      }

      try {
        const logEntry = JSON.parse(message);

        if (logEntry && logEntry.log) {
          const newLog: LogEntry = {
            timestamp: new Date().toISOString(),
            message: logEntry.log.trim(),
          };

          setLogs((prevLogs) => [...prevLogs, newLog]);
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

  const timelineData = logs.map((log) => ({
    title: new Date(log.timestamp).toLocaleString(),
    type: determineLogType(log.message),
    content: (
      <pre className="text-sm font-mono whitespace-pre-wrap">{log.message}</pre>
    ),
  }));

  return (
    <div className="w-full">
      {logs.length > 0 ? (
        <Timeline data={timelineData} />
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-neutral-500 animate-pulse">
            Waiting for deployment logs...
          </p>
        </div>
      )}
    </div>
  );
};

export default Logs;
