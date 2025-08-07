# ISRO Moon Project

A React + Vite application for moon visualization and data analysis.

## System Requirements

### Node.js and npm Versions
- **Node.js**: 18.x or 20.x (LTS recommended)
- **npm**: 9.x or 10.x
- **Operating System**: Windows, macOS, Linux/Ubuntu


## Project Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd isro-moon
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Build
```bash
npm run preview
```

## Installation Guide

### Windows & macOS
Installation works seamlessly on Windows and macOS with standard Node.js installation.


### Linux/Ubuntu Installation

#### 1. Install Node.js and npm

**Option A: Using NodeSource Repository (Recommended)**
```bash
# Update package index
sudo apt update

# Install curl if not already installed
sudo apt install -y curl

# Add NodeSource repository for Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js and npm
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

**Option B: Using Node Version Manager (nvm)**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload terminal or run:
source ~/.bashrc

# Install and use Node.js 20.x
nvm install 20
nvm use 20
nvm alias default 20
```

#### 2. Install Required System Dependencies

For Linux/Ubuntu systems, install additional dependencies to resolve crypto and native module compilation issues:

```bash
# Install build essentials and Python
sudo apt update
sudo apt install -y build-essential python3 python3-pip

# Install additional dependencies for native modules
sudo apt install -y libnss3-dev libatk-bridge2.0-dev libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libxss1 libasound2

# Install git if not already installed
sudo apt install -y git
```

#### 3. Fix Crypto Function Errors

If you encounter crypto-related errors on Linux, try these solutions:

**Solution 1: Use Legacy OpenSSL Provider**
```bash
export NODE_OPTIONS="--openssl-legacy-provider"
```

**Solution 2: Update npm and clear cache**
```bash
# Update npm to latest version
sudo npm install -g npm@latest

# Clear npm cache
npm cache clean --force

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Troubleshooting

### Common Linux/Ubuntu Issues

#### Crypto Function Error
```
Error: digital envelope routines::unsupported
```
**Solution:**
```bash
export NODE_OPTIONS="--openssl-legacy-provider"
npm run dev
```

#### Permission Errors
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

#### Canvas/WebGL Issues
```bash
# Install additional graphics libraries
sudo apt install -y libgl1-mesa-glx libglu1-mesa libxrender1 libxext6 libxfixes3
```

#### Memory Issues
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
```

### Environment Variables (Linux/Ubuntu)

Add these to your `~/.bashrc` or `~/.zshrc`:
```bash
# Add to ~/.bashrc
export NODE_OPTIONS="--openssl-legacy-provider --max-old-space-size=4096"
export PATH="$PATH:/usr/local/bin"

# Reload terminal
source ~/.bashrc
```

## Dependencies

### Main Dependencies
- React 19.1.0
- React DOM 19.1.0
- Vite 7.0.4

### Key Libraries
- Three.js 0.179.1
- React Three Fiber 9.3.0
- React Three Drei 10.6.1
- OpenLayers 10.6.1
- D3 Fetch 3.0.1
- Papa Parse 5.5.3

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Notes

- This project uses ES modules and requires Node.js 16+ for optimal performance
- WebGL support is required for 3D visualization features
- For production deployment, ensure proper HTTPS configuration for WebGL contexts