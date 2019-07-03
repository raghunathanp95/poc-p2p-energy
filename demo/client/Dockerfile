FROM node:10.13.0-alpine
RUN apk --no-cache add git

# Working DIR
WORKDIR /usr/src/app

# Copy everything from current Folder
COPY . ./

# Set the env variables
ARG CONFIG_ID
ARG GITHUB_TOKEN
RUN echo "CONFIG_ID=$CONFIG_ID"
ENV REACT_APP_CONFIG_ID=$CONFIG_ID

# We are npm installing from private repos so we need github token with access
RUN git config --global url."https://${GITHUB_TOKEN}:@github.com/".insteadOf "https://github.com/"

# Add the common package in
RUN git clone https://github.com/iotaledger/poc-p2p-energy.git poc-p2p-energy
RUN cd poc-p2p-energy/common && npm install && npm run build
RUN sed -i 's/..\/..\/common/poc-p2p-energy\/common/g' package.json

# Running required steps to prepare the app prod build
RUN npm install
RUN npm run build

# Remove all the node_modules so the docker image doesn't exceeds max size
RUN rm -rf node_modules
RUN rm package.json
RUN rm -rf poc-p2p-energy
RUN npm install serve
RUN apk del git

EXPOSE 4001:4001

# Serve the prod build from the build folder
CMD ["./node_modules/.bin/serve", "-s", "build", "-p", "4001"]
