# Marshmello - Vercel Clone

Marshmello is a Vercel-like service that allows users to build and deploy projects directly from a Git repository. It handles builds using AWS Fargate, reverse proxies S3 content, and communicates via WebSocket for real-time build logs.

## Project Demo (Recorded Video)

I had initially set up this project live using AWS ECS, but unfortunately, I got billed $100 after leaving it running for a month. To avoid further costs, I have taken the live project down. However, here’s a recorded video showcasing the project in action: [Project Demo Video](https://drive.google.com/file/d/15tcp4x_zA0W4vMHGV1l01u0wuDr0aSc5/view?usp=drive_link).

Please note that while the UI was further improved after this recording, the video demonstrates the core functionality. You can also observe the logs being generated, which highlight the backend processes.


## Features

- **Build and Deploy Projects**: Clone from a Git repository and deploy the project on AWS ECS using Fargate.
- **Real-time Logs**: Receive real-time updates on project builds via Redis and WebSockets.
- **S3 Proxying**: Reverse proxy for serving content from S3, with customizable paths.
- **Node.js API**: Expose API endpoints to manage projects, builds, and deployments.
- **Socket Server**: Get build updates through WebSocket events.

## Architecture

This project consists of several components:

- **API Server** (`/api-server`): Handles incoming project builds and manages AWS ECS tasks.
- **Build Server** (`/build-server`): Executes the build, uploads artifacts to S3, and reports progress via Redis.
- **S3 Reverse Proxy** (`/s3-reverse-proxy`): Serves content from S3, supporting different subdomains.

<!-- ## Prerequisites

- [Node.js](https://nodejs.org/)
- AWS account (for ECS, Fargate, and S3)
- Redis server (for pub/sub)
- Docker (optional, for running services in containers)
  s

## Setup

### Clone the Repository

```bash
git clone https://github.com/<your-username>/marshmello
cd marshmello

```

### Install Dependencies

Install dependencies for each server.

```bash
# Install dependencies for api-server
cd api-server
npm install

# Install dependencies for build-server
cd ../build-server
npm install

# Install dependencies for s3-reverse-proxy
cd ../s3-reverse-proxy
npm install
```
### Environment Variables
You need to create a .env file in the root of the project and add the following variables:

```bash

# AWS Configuration
REGION_ECS=your-region
ACCESSID_ECS=your-access-key-id
SECRETKEY_ECS=your-secret-access-key
CLUSTER_CONFIG=your-cluster
TASK_CONFIG=your-task
SUBNETS=subnet-ids
SECURITY_GROUPS=security-group-ids

# Redis Configuration
REDIS_URL=redis://your-redis-url

# S3 Configuration
BASE_PATH=s3://your-s3-bucket

# Project Configuration
PROJECT_ID=your-project-id
```
### Environment Variables -->
