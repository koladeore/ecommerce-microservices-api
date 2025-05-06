FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies, including Prisma CLI
RUN npm install

# Copy the rest of the app
COPY . .

COPY prisma ./prisma

# Prisma generate to prepare client
RUN npx prisma generate

# Build the app
RUN npm run build

EXPOSE 3003

# IMPORTANT: Allow running arbitrary Prisma CLI commands inside container
ENTRYPOINT ["npm"]
CMD ["start"]
