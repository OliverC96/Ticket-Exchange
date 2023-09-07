# Use minimal/compact version of node as the base image
FROM node:alpine

# Set the working directory inside the container to be /app
WORKDIR /app

# Copy over project files to the working directory, and install required dependencies
COPY ./package.json ./
RUN npm install
COPY ./ ./

# Set the primary command of the resultant image to be 'npm start'
CMD ["npm", "start"]