# Stage 1: Build Stage
# -------------------
# En esta etapa, instalamos todas las dependencias (incluidas las de desarrollo)
# y compilamos el código TypeScript a JavaScript.

FROM node:22-slim AS builder

# Establecer el directorio de trabajo
WORKDIR /usr/app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar los archivos de manifiesto del proyecto raíz y de la API
# Esto nos permite aprovechar el cache de capas de Docker si no cambian.
COPY package.json pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/

# Instalar dependencias de producción para todo el monorepo
# Usamos --filter para instalar solo las dependencias del workspace 'api' y sus dependencias compartidas.
RUN pnpm install --filter api --prod --frozen-lockfile

# Copiar el resto del código fuente de la API y del proyecto
COPY . .

# Compilar el código TypeScript
# El tsconfig.json debería tener la configuración para compilar a un directorio (ej. 'dist')
RUN pnpm --filter api run build


# Stage 2: Production Stage
# -------------------------
# En esta etapa, creamos la imagen final. Copiamos solo los artefactos
# necesarios de la etapa de 'builder', resultando en una imagen mucho más pequeña.

FROM node:22-slim

# Establecer el directorio de trabajo
WORKDIR /usr/app

# Copiar las dependencias de producción desde la etapa 'builder'
COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/apps/api/node_modules ./apps/api/node_modules

# Copiar los archivos de package.json
COPY apps/api/package.json ./apps/api/package.json

# Copiar el código JavaScript compilado desde la etapa 'builder'
COPY --from=builder /usr/app/apps/api/dist ./apps/api/dist

# Exponer el puerto en el que correrá la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
# Asume que el script de inicio está en 'apps/api/dist/index.js'
CMD ["node", "apps/api/dist/index.js"]
