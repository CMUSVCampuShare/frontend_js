# Use Node.js image as the base image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install project dependencies
RUN npm install

# Copy all files from the current directory to the container
COPY . .

# Build the React app
RUN npm run build

# Set the command to run the React app
CMD ["npm", "start"]
