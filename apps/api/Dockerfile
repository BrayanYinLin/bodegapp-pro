# Stage 1: Build Stage
# -------------------
# En esta etapa, instalamos todas las dependencias (incluidas las de desarrollo)
# y compilamos el código TypeScript a JavaScript.

FROM node:22-slim AS builder

WORKDIR /usr/app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/

RUN pnpm install --filter api --prod --frozen-lockfile

COPY . .

RUN pnpm --filter api run build


# Stage 2: Production Stage
# -------------------------
# En esta etapa, creamos la imagen final. Copiamos solo los artefactos
# necesarios de la etapa de 'builder', resultando en una imagen mucho más pequeña.

FROM node:22-slim

WORKDIR /usr/app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/package.json

RUN pnpm run --filter api... --prod --no-frozen-lockfile

COPY --from=builder /usr/app/apps/api/dist ./apps/api/dist

EXPOSE 3000

CMD ["pnpm", "start:api"]
