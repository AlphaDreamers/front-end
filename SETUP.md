# Docker Setup Guide

This guide explains how to build and run the Next.js application using Docker.

## Prerequisites

- Docker installed on your machine
- Docker Desktop running (if using macOS/Windows)

## Build the Docker Image

1. Open terminal in the project root directory
2. Build the Docker image:
   ```bash
   docker build -t my-nextjs-app .
   ```

## Run the Container

1. Start the container:
   ```bash
   docker run -p 3000:3000 my-nextjs-app
   ```

2. If port 3000 is already in use, use a different port:
   ```bash
   docker run -p 3001:3000 my-nextjs-app
   ```

## Access the Application

1. Open your web browser
2. Navigate to: `http://localhost:3000`
3. If you used a different port, use that port instead (e.g., `http://localhost:3001`)

## Stopping the Container

- Press `Ctrl+C` in the terminal where the container is running
- Or run `docker stop <container-id>` in another terminal

## Troubleshooting

### Port Already in Use
If you get "port is already allocated" error:
- Use a different port: `docker run -p 3001:3000 my-nextjs-app`
- Or stop the service using port 3000

### Build Issues
If the build fails:
- Make sure Docker has enough memory allocated (at least 4GB recommended)
- Try clearing Docker cache: `docker system prune`

### Application Not Loading
- Wait a few seconds after "Ready on http://localhost:3000" appears
- Check if there are any error messages in the terminal
- Try refreshing the browser page