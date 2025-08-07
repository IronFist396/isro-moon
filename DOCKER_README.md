# React + Vite Dockerized Development Setup
<br/>

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running
- Git installed (to clone this repo)

<br/>

## Quick Start Guide

### 1. Clone the Repository

```bash
git clone https://github.com/IronFist396/isro-moon.git
cd isro-moon
```

### 2. Build the Docker Image
```bash
docker build -t isro-moon .
``` 
This creates a Docker image named isro-moon using Node.js v22.18.0 and installs all required dependencies.

### 3. Run the Container (with Live Reload)

Replace ```${PWD}``` with ```%cd%``` if you're on Windows CMD.
 macOS/Linux:
```bash
docker run -it -p 5173:5173 -v ${PWD}:/app -v /app/node_modules isro-moon
```
 Windows CMD:
```bash
docker run -it -p 5173:5173 -v %cd%:/app -v /app/node_modules isro-moon
```
Windows PowerShell:
```bash
docker run -it -p 5173:5173 -v ${PWD}:/app -v /app/node_modules isro-moon
```

### 4. Open the App
Once the container is running, open your browser at:
```
http://localhost:5173
```
Your Vite-powered React app should now be live and ready for development!

### Notes and Troubleshooting
- Ensure Docker Desktop is running before executing the commands.
- Vite uses port 5173 by default in dev mode. That’s why we map -p 5173:5173 in the run command. Ensure port 5173 is not in use by another service.

#### Live reload not working?
Add this to a ```.env``` file in your project root:

```env
CHOKIDAR_USEPOLLING=true
```
This makes Vite's file watcher work correctly inside Docker on Windows/macOS.
### Stopping the Container
To stop the running container, press `Ctrl + C` in the terminal where the container is running. If you want to remove the container after stopping it, you can run:

```bash
docker ps -a  # to find the container ID
docker rm <container_id>
```
