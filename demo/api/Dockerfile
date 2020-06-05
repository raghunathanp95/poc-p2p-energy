FROM node:10.18.0-alpine

# Working DIR
WORKDIR /usr/src/app

# Copy everything from current Folder
COPY . ./

# Set the env variables
RUN echo "CONFIG_ID=$CONFIG_ID"

EXPOSE 4000

# Serve the prod build from the dist folder
CMD ["node", "./dist/index"]