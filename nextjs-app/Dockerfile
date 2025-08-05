# Stage 1: Build the Next.js app
FROM node:lts-jod AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Generate TypeScript types from API swagger before building
RUN npm run generate-prod-types

# Build the production application
RUN npm run build

# Stage 2: Create the final production image
FROM node:lts-jod
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/.env.local ./.env.local

# Install dependencies in the final image
RUN npm install --omit=dev

# The port Next.js will run on *inside* the container
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Command to start the app
CMD ["npm", "start"]