#   build a Node Docker Image for our app

#   build from the latest node image from Docker Hub (base image)
FROM node:latest

#   create a new directory
RUN mkdir -p /usr/src/app

#   assign /usr/src/app as the working directory
WORKDIR /usr/src/app

#   copy package.json to the directory (for our dependencies)
COPY package.json /usr/src/app/

#   install the dependencies in package.json
RUN npm install

#   copy entire local directory (our app) into working directory in order to bundle app source code
COPY . /usr/src/app

#   container will listen on port 3000
EXPOSE 3000

#   npm start, execute the container
CMD [ "npm", "start" ]