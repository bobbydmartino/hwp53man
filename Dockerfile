FROM node:20-alpine

WORKDIR /app

# Copy only package files and install first
COPY package*.json ./
RUN npm install

# Then copy the rest
COPY . .

CMD ["npm", "start"]
