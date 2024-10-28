"use client";

import React, { useEffect, useState } from 'react';
import { Timeline } from './ui/timeline';
import { io, Socket } from 'socket.io-client';

interface LogEntry {
  timestamp: string;
  message: string;
}

interface LogsProps {
  projectSlug: string;
}

const Logs: React.FC<LogsProps> = ({ projectSlug }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:9002');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
      newSocket.emit('subscribe', `logs:${projectSlug}`);
    });

    newSocket.on('message', (message: string) => {
      try {
        const logEntry: LogEntry = JSON.parse(message);
        setLogs(prevLogs => [...prevLogs, logEntry]);
      } catch (error) {
        console.error('Error parsing log message:', error);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [projectSlug]);

  const timelineData = logs.map((log, index) => ({
    title: new Date(log.timestamp).toLocaleTimeString(),
    content: (
      <div key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">{log.message}</p>
      </div>
    ),
  }));

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Build Logs</h2>
      {logs.length > 0 ? (
        <Timeline data={timelineData} />
      ) : (
        <p className="text-center text-gray-500">Waiting for logs...</p>
      )}
    </div>
  );
};

export default Logs;

