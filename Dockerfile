FROM node:14-slim

# for some reason git is required by `npm install`
RUN apt update && apt install git -y

# set main app dir
WORKDIR /app

# copy app definition
COPY package.json /app

# copy app files
COPY dist/ /app/dist

# Install dependency
RUN npm install

# Expose the app port
EXPOSE 4000

# Run the app
CMD ["node", "./dist/server/main.js"]
