const { exec } = require("child_process");
const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const mime = require("mime-types");
const Redis = require("ioredis");

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const publisher = new Redis(process.env.REDIS_URL, {
  tls: {
    rejectUnauthorized: false,
  },
});

publisher.on("error", (err) => {
  console.error("Redis connection error:", err);
});
//fix process.env path it might create an isssue.

const s3Client = new S3Client({
  region: process.env.REGION_ECS,
  credentials: {
    accessKeyId: process.env.ACCESSID_ECS,
    secretAccessKey: process.env.SECRETKEY_ECS,
  },
});

const PROJECT_ID = process.env.PROJECT_ID;

function publishLog(log) {
  publisher.publish(`logs:${PROJECT_ID}`, JSON.stringify({ log }));
}

async function init() {
  console.log("Executing script.js");
  publishLog("Build Started...");
  const outDirPath = path.join(__dirname, "output");

  const p = exec(`cd ${outDirPath} && npm install && npm run build`);
  // p executes a shell command using exec()
  p.stdout.on("data", function (data) {
    console.log(data.toString());
    publishLog(data.toString());
  });

  p.stdout.on("error", function (data) {
    console.log("Error", data.toString());
    publishLog(`error: ${data.toString()}`);
  });
  p.on("close", async function () {
    console.log("Build Complete");
    publishLog("Build Complete...");
    const distFolderPath = path.join(__dirname, "output", "dist");
    const distFolderContents = fs.readdirSync(distFolderPath, {
      recursive: true,
    });
    publishLog("Starting to Upload");
    //goes inside the files of each folder
    for (const file of distFolderContents) {
      const filePath = path.join(distFolderPath, file);
      if (fs.lstatSync(filePath).isDirectory()) continue;
      console.log("uploading", filePath);
      publishLog(`Uploading... ${file}`);

      const command = new PutObjectCommand({
        Bucket: "output-vercel",
        Key: `__outputs/${PROJECT_ID}/${file}`,
        Body: fs.createReadStream(filePath),
        ContentType: mime.lookup(filePath), // checks the type of file
      });
      await s3Client.send(command);
      publishLog(`Uploaded ${file}`);
      console.log("uploaded", filePath);
    }
    console.log("Done...");
    publishLog("Done...");
  });
}
init();
