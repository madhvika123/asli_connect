# Use official Node.js image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build application
RUN npm run build

# Install serve package
RUN npm install -g serve

# Expose application port
EXPOSE 3000

# Start application
CMD ["serve", "-s", "build", "-l", "3000"]
