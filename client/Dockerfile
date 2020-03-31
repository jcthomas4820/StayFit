FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Add both package & package-lock.json files
COPY package*.json ./

# Install npm without all of the output
RUN npm install --silent

# Copy all of the souce files
COPY . .

# Expose port
EXPOSE 3000

# Start the app 
CMD [ "npm", "start" ]