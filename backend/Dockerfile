# Use the official Node.js image
FROM node:16

# Install required dependencies for Puppeteer and Chromium
RUN apt-get update && apt-get install -y \
  wget \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libx11-xcb1 \
  libgdk-pixbuf2.0-0 \
  libnss3 \
  libxss1 \
  lsb-release \
  xdg-utils \
  libnspr4 \
  libatk-bridge2.0-0 \
  libgtk-3-0 \
  libgbm1 \
  libsecret-1-0 \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Expose the port the backend will run on
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
