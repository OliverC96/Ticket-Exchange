# Use minimal/compact version of node as the base image
FROM node:alpine AS base

# Set the working directory inside the container to be /app
WORKDIR /app

# Copy over project files to the working directory, and install required dependencies
COPY ./package.json ./
RUN npm install --omit=dev
COPY ./ ./

# Run deployment script for dev environment (i.e., Skaffold on localhost)
FROM base AS image-dev
CMD ["npm", "start"]

# Run deployment script for prod environment (i.e., DigitalOcean)
FROM base AS image-prod
CMD ["npm", "run", "build"]