FROM node:alpine as base

WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY ./ ./

# Run deployment script for dev environment (i.e., Skaffold on localhost)
FROM base as image-dev
CMD ["npm", "run", "dev"]

# Run deployment script for prod environment (i.e., DigitalOcean)
FROM base as image-prod
CMD ["npm", "run", "build"]