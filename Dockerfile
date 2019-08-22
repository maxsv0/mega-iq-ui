FROM node:8-alpine

# for some reason git is required by `npm install`
RUN apk update && apk add --no-cache git

# set main app dir
WORKDIR /app

# copy app definition
COPY package.json /app

# copy app files
COPY dist/ /app/dist

# Install dependency
RUN npm install

# Install PM2 process manager
RUN npm install -g pm2

# Expose the app port
EXPOSE 4000

# Run the app
CMD ["pm2-docker", "/app/dist/server.js"]
