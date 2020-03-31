FROM node:8

# Create app directory
WORKDIR /usr/src/app

RUN npm install -g nodemon

# Add both package & package-lock.json files
COPY package*.json ./

# Install npm without all of the output
RUN npm install --silent 

# Copy all of the souce files
COPY . .

#Expose port
EXPOSE 3001

# Start the app 
CMD [ "npm", "start" ]