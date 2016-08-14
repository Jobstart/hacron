FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/lib
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY npm-shrinkwrap.json /usr/src/app/
RUN npm install --production
RUN npm install babel-runtime # Shim for linux

# Bundle app source
COPY lib /usr/src/app/lib/

CMD [ "npm", "start" ]
