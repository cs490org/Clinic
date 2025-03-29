# Build stage
FROM node:20.15.1-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:20.15.1-alpine
RUN npm install -g serve
# Copy the production build from the build stage
COPY --from=build /app/dist /app/dist
# Cloud Run provides the port via the PORT environment variable; fallback to 3000 if not set
EXPOSE 3000
CMD [ "sh", "-c", "serve -s /app/dist -l ${PORT:-3000}" ]
