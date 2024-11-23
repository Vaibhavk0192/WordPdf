# Step 1: Build the Vite app using Node.js
FROM node:16 as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app using Vite
RUN npm run build

# Step 2: Serve the static files using Nginx
FROM nginx:alpine

# Remove the default Nginx index.html to prevent conflicts
RUN rm -rf /usr/share/nginx/html/*

# Copy the build files from the previous stage into Nginx's html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port Nginx is serving
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
