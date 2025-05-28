FROM node:20-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# 本番用イメージ
FROM nginx:1.25-alpine
COPY --from=build /app/build /usr/share/nginx/html
