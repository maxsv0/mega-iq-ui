FROM node:10-slim

# install git ->  for some reason git is required by `npm install`
RUN apt update && apt install git -y

# install cron and curl
RUN apt install curl cron -y

# Add crontab file in the cron directory
ADD cron-api-load /etc/cron.d/cron-api-load

# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/cron-api-load

# Apply cron job
RUN crontab /etc/cron.d/cron-api-load

# Create the log file to be able to run tail
RUN touch /var/log/cron.log

# Run the command on container startup
CMD cron && tail -f /var/log/cron.log

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
