FROM node:18 AS build
WORKDIR /app

# copy only package files first for better caching
COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine AS prod
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY package.json ./
RUN npm install --production

EXPOSE 3000
CMD ["node", "server/index.js"]
