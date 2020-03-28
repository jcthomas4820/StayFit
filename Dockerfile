#   specify node version
FROM node:10.15.0

#   specify directory of app
WORKDIR /usr/src/app

#   install the dependencies from package.json and package-lock.json
COPY package*.json ./
#   run npm install for node_modules
RUN npm install

#   bundle the app source
COPY . .

#   use port 8080
EXPOSE 8080

#   run the app
CMD ["npm", "start"]