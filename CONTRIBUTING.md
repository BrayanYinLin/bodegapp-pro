# Contribuir a BodegApp Pro

¡Gracias por tu interés en contribuir a BodegApp Pro! Tu ayuda es valiosa para hacer de este un proyecto increíble.

Para asegurar que el proceso sea lo más fluido posible para todos, por favor sigue estas guías.

## Tabla de Contenidos

- [Configuración Inicial](#configuración-inicial)
  - [Variables de Entorno](#variables-de-entorno)
- [Flujo de Desarrollo](#flujo-de-desarrollo)
- [Hooks de Git con Husky](#hooks-de-git-con-husky)
- [Guía de Mensajes de Commit](#guía-de-mensajes-de-commit)

---

## Configuración Inicial

1.  **Clona el repositorio:**

    ```bash
    git clone https://github.com/tu-usuario/bodegapp-pro.git
    cd bodegapp-pro
    ```

2.  **Instala las dependencias:**
    Este proyecto utiliza `pnpm` como gestor de paquetes en un monorepo.
    ```bash
    pnpm install
    ```
3. **Configura Husky**
    Este proyecto usa Husky, ejecuta primero
    ```bash
    pnpm prepare
    ```
    Luego:
    ```bash
    echo "pnpm lint-staged" > .husky/pre-commit
    ```

### Variables de Entorno

Para que el backend (`apps/api`) funcione correctamente, necesitas crear un archivo `.env` dentro de la carpeta `apps/api`.

1.  Navega a la carpeta de la API:

    ```bash
    cd apps/api
    ```

2.  Crea un archivo llamado `.env` en la raíz del proyecto y copia el contenido del siguiente ejemplo.

    **`.env`**

    ```env
    # Puerto en el que correrá la API
    PORT=3000

    # Configuración de la Base de Datos (PostgreSQL)
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=postgres
    DB_PASSWORD=tu_contraseña_segura
    DB_NAME=bodegapp

    # Secreto para firmar los JSON Web Tokens (JWT)
    JWT_SECRET=este_es_un_secreto_muy_largo_y_dificil_de_adivinar

    # Entorno (development, production, test)
    NODE_ENV=development
    ```

3.  Ajusta los valores (especialmente los de la base de datos) para que coincidan con tu configuración local.

---

## Flujo de Desarrollo

1.  Crea una nueva rama para tu funcionalidad o corrección:

    ```bash
    git checkout -b feat/nombre-de-la-funcionalidad
    # o
    git checkout -b fix/descripcion-del-bug
    ```

2.  Realiza tus cambios en el código.

3.  Añade tus cambios al "staging area":

    ```bash
    git add .
    ```

4.  Realiza un commit siguiendo nuestra [guía de mensajes de commit](#guía-de-mensajes-de-commit).

    ```bash
    git commit -m "feat: agrega el módulo de productos"
    ```

5.  Sube tus cambios a GitHub:

    ```bash
    git push origin feat/nombre-de-la-funcionalidad
    ```

6.  Abre un Pull Request en el repositorio de GitHub.

---

## Hooks de Git con Husky

Este proyecto utiliza [Husky](https://typicode.github.io/husky/) para ejecutar scripts automáticamente antes de cada commit (`pre-commit`).

**¿Qué hace?**
Antes de que puedas finalizar un commit, Husky ejecutará automáticamente los linters y formateadores de código (como ESLint y Prettier).

**¿Por qué es importante?**
Esto asegura que todo el código que se sube al repositorio sigue las mismas guías de estilo y calidad. Si tu código tiene errores de formato o de linter, **el commit será rechazado**.

Deberás corregir los errores que te muestre la consola y volver a intentar el commit. Esto mantiene nuestro código limpio y consistente.

---

## Guía de Mensajes de Commit

Usamos la especificación de [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Esto nos ayuda a generar el changelog automáticamente y a mantener un historial de cambios legible.

El formato es: `<tipo>(<ámbito opcional>): <descripción>`

- **`feat`**: Para nuevas funcionalidades.
- **`fix`**: Para correcciones de bugs.
- **`docs`**: Para cambios en la documentación.
- **`style`**: Para cambios de formato (espacios, comas, etc.).
- **`refactor`**: Para cambios en el código que no arreglan un bug ni añaden una funcionalidad.
- **`test`**: Para añadir o corregir tests.
- **`chore`**: Para actualizaciones de tareas de build, configuración, etc.

**Ejemplos:**

```
feat(api): agregar endpoints para el CRUD de productos
fix(client): corregir el bug de login que no redirigía
docs: actualizar el archivo CONTRIBUTING.md
```
