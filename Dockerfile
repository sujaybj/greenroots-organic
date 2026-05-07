FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/

RUN npm install
COPY . .
RUN npm run build --workspace client

FROM node:20-alpine AS prod
WORKDIR /app

COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/package-lock.json ./package-lock.json
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/server ./server
COPY --from=deps /app/client/build ./client/build

ENV NODE_ENV=production
WORKDIR /app/server
EXPOSE 5000
CMD ["node", "server.js"]
