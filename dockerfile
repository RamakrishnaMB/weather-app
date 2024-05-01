# Use node base image, using alpine due to light weight
FROM node:16-alpine

# Setting workdir to /weather-app
WORKDIR /weather-app

# Copying package.json and package-lock.json to the working directory
COPY package*.json ./

# Install packages from package.json
RUN npm install

# Bundle app source by copying the rest of the code
COPY . .

# Exposing port 3000 for app
EXPOSE 3000

# Run the app when the container launches
CMD ["npm", "start"]