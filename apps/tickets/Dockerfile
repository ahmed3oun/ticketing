FROM node:23-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
CMD ["npm", "run", "start"]
# This Dockerfile sets up a Node.js environment for the ticketing tickets service.