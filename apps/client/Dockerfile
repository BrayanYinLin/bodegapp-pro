# Build
FROM node:22-slim AS builder

WORKDIR /usr/app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
COPY apps/client/package.json ./apps/client/

RUN pnpm install --filter client --frozen-lockfile

COPY . .

RUN pnpm --filter client run build

# Stage

FROM nginx:alpine

COPY --from=builder /usr/app/apps/client/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]