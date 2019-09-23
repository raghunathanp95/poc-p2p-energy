FROM node:10.13.0-alpine
RUN apk --no-cache add git python make g++

# Working DIR
WORKDIR /usr/src/app

# Copy everything from current Folder
COPY . ./

# Set the env variables
ARG GITHUB_TOKEN
RUN echo "CONFIG_ID=$CONFIG_ID"

# We are npm installing from private repos so we need github token with access
RUN git config --global url."https://${GITHUB_TOKEN}:@github.com/".insteadOf "https://github.com/"

# Add the common package in
RUN git clone https://github.com/iotaledger/poc-p2p-energy.git poc-p2p-energy
RUN cd poc-p2p-energy/common && npm install && npm run build
RUN sed -i 's/..\/..\/common/poc-p2p-energy\/common/g' package.json

# Running required steps to prepare the api prod build
RUN npm install
RUN npm run build

# Remove unneccesary so the docker image doesn't exceeds max size
RUN apk del git python make g++
RUN npm prune --production
RUN rm -rf poc-p2p-energy/common/node_modules

EXPOSE 4000

# Serve the prod build from the dist folder
CMD ["node", "./dist/index"]