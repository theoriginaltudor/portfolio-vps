# Stage 1: Build the Next.js app
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the production application
RUN npm run build

# Stage 2: Create the final production image
FROM node:20-alpine
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# The port Next.js will run on *inside* the container
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Command to start the app
CMD ["npm", "start"]