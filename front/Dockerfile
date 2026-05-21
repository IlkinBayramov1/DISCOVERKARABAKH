# Use a lightweight Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy everything so npm can resolve monorepo workspaces
COPY . .

# Declare the build argument
ARG VITE_API_URL
# Expose it as an environment variable during the docker build process
ENV VITE_API_URL=$VITE_API_URL

# Install dependencies across the monorepo
RUN npm install

ENV VITE_BASE_PATH="/vendor/"

# Build the React app (Vite will now safely read the ENV variable above)
RUN npm run build

# Install 'serve' to host static assets
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]