Backend Service – Installation & Deployment Guide

This repository contains a Node.js backend service containerized using Docker, deployed on AWS EC2, and integrated with AWS S3, CloudFront CDN, FFmpeg, Supabase, and multiple external APIs.

🛠 Tech Stack

Node.js (v20 – Alpine)

Docker

AWS EC2

AWS S3 (File & Video Storage)

AWS CloudFront (CDN)

FFmpeg (Media Processing)

Supabase

External APIs

Google API

YouTube Transcript API

CloudConvert API

📁 Project Structure
.
├── src/
├── package.json
├── Dockerfile
├── .env
└── README.md

🔐 Environment Variables

Create a .env file in the root directory and add the following variables:

CDN=

GOOGLE_API_KEY=

SUPABASE_URL=
SUPABASE_API_KEY=

AWS_ACCESS_KEY=
AWS_SECRET_KEY=
S3_BUCKET_NAME=

YT_TRANSCRIPT_API_KEY=

CLOUD_CONVERT_API=


 Do NOT commit the .env file to version control.

 Run Locally (Without Docker)
npm install --legacy-peer-deps
npm start


The server will start on:

http://localhost:3000

🐳 Docker Configuration
Dockerfile
FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache ffmpeg

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

🏗 Build Docker Image
docker build -t backend-app .

▶️ Run Docker Container
docker run -d \
  -p 3000:3000 \
  --env-file .env \
  --name backend-container \
  backend-app
