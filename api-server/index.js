const express = require("express");
const { generateSlug } = require("random-word-slugs");
const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs");
const { Server } = require("socket.io");
const Redis = require("ioredis");

const app = express();
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const PORT = 9000;
const subscriber = new Redis(process.env.REDIS_URL, {
  tls: {
    rejectUnauthorized: false,
  },
});
const io = new Server({ cors: "*" });

io.on("connection", (socket) => {
  socket.on("subscribe", (channel) => {
    socket.join(channel);
    socket.emit("message", `Joined ${channel}`);
  });
});

io.listen(9002, () => console.log("Socket server 9002"));

app.use(express.json());

const ecsClient = new ECSClient({
  region: process.env.REGION_ECS,
  credentials: {
    accessKeyId: process.env.ACCESSID_ECS,
    secretAccessKey: process.env.SECRETKEY_ECS,
  },
});
const config = {
  CLUSTER: process.env.CLUSTER_CONFIG,
  TASK: process.env.TASK_CONFIG,
};

app.post("/project", async (req, res) => {
  const { gitURL, slug } = req.body;
  const projectSlug = slug ? slug : generateSlug();

  const command = new RunTaskCommand({
    cluster: config.CLUSTER,
    taskDefinition: config.TASK,
    launchType: "FARGATE",
    count: 1,
    networkConfiguration: {
      awsvpcConfiguration: {
        assignPublicIp: "ENABLED",
        subnets: process.env.SUBNETS.split(","),
        securityGroups: process.env.SECURITY_GROUPS.split(","),
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: "builder-image",
          environment: [
            { name: "GIT_REPOSITORY__URL", value: gitURL },
            {
              name: "PROJECT_ID",
              value: projectSlug,
            },
          ],
        },
      ],
    },
  });
  await ecsClient.send(command);
  return res.json({
    status: "queued",
    data: { projectSlug, url: `http://${projectSlug}.localhost:8000` },
  });
});
async function initRedisSubscribe() {
  console.log("Subscribed to logs...");
  subscriber.psubscribe("logs:*");
  subscriber.on("pmessage", (pattern, channel, message) => {
    io.to(channel).emit("message", message);
  });
}
initRedisSubscribe();

app.listen(PORT, () => console.log(`API server is running on ${PORT}`));
