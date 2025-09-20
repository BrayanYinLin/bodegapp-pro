# Sistema de Gestión de Inventario

## 1. Introducción al Diseño del Sistema

**Objetivo:** Desarrollar una plataforma web de gestión de inventario orientada a pequeñas empresas, permitiendo el control de productos, stock, ventas, y reportes, con enfoque en escalabilidad y facilidad de uso.

**Stakeholders:**
- Dueño del negocio (cliente)
- Vendedores
- Administrador del sistema
- Equipo de desarrollo

---

## 2. Requisitos del Sistema

### Visión del Sistema

**Propósito:** Digitalizar el control de inventarios y ventas en PYMEs con una solución intuitiva, accesible y adaptable a diferentes rubros.

**Alcance:**
- Control de productos, stock y proveedores
- Registro de ventas
- Reportes de inventario y movimientos
- Roles de usuario con permisos
- Interfaz web responsiva

### Especificación de Requisitos

**Funcionales:**
- Registrar, editar y eliminar productos
- Registrar entradas/salidas de stock
- CRUD de proveedores
- Registrar ventas y asociarlas a productos
- Autenticación y control de acceso
- Generación de reportes (por fechas, por producto, etc.)

**No funcionales:**
- Sistema accesible vía web (responsive)
- Tiempo de respuesta < 2 segundos en operaciones comunes
- Base de datos persistente (ej: PostgreSQL)
- Seguridad mediante JWT y roles
- Despliegue en nube (Railway)

### Verificación y Validación
- Pruebas unitarias y de integración
- Validación de requisitos con el cliente
- Demo funcional por módulo

### Trazabilidad
- Cada requisito funcional se vincula a un módulo del sistema y a un caso de uso UML correspondiente.

---

## 3. Modelamiento de Datos

### Modelo Conceptual (Entidad-Relación simplificado)

**Entidades principales:**
- Producto
- Proveedor
- Categoría
- Usuario
- Venta
- DetalleVenta

**Relaciones:**
- Un producto tiene una categoría
- Una venta tiene muchos detalles
- Cada detalle se relaciona a un producto

### Modelo Lógico
- Tablas normalizadas, claves primarias y foráneas
- Tipos de datos definidos
- Índices en campos frecuentes (ej: código de producto, fecha de venta)

### Modelo Físico
- PostgreSQL
- Scripts SQL para crear estructuras y relaciones
- Vistas para reportes agregados

---

## 4. Modelamiento de Procesos de Negocio (BPM)

### Proceso: Registrar una venta

**Diagrama BPMN** (texto descriptivo):
```plaintext
Inicio → Buscar producto → Agregar al carrito → Verificar stock → Registrar cliente → Registrar venta → Actualizar stock → Generar comprobante → Fin
```

---

## 5. Modelamiento del Sistema (UML)

### 5.1. Casos de Uso
- Login
- Registrar producto
- Consultar inventario
- Registrar proveedor
- Registrar venta
- Generar reporte

### 5.2. Diagrama de Clases
**Clases base:**
- `Producto`
- `Usuario` (con herencia: Admin, Vendedor)
- `Venta`, `DetalleVenta`
- `Proveedor`, `Categoria`

### 5.3. Diagrama de Secuencia
**Ejemplo:** _Registrar una venta_
- Usuario → Sistema: selecciona producto
- Sistema → Base de datos: verifica stock
- Usuario → Sistema: confirma venta
- Sistema → BD: guarda venta y detalles
- Sistema → BD: actualiza stock

### 5.4. Diagrama de Actividad
_Flujo completo desde el login hasta el registro de una venta._

### 5.5. Diagrama de Estado
**Ejemplo para entidad Producto:**
- Disponible → Bajo stock → Agotado

### 5.6. Diagrama de Componentes
- Frontend (React)
- Backend (Node JS Express)
- Base de Datos (PostgreSQL)
- Servicio de autenticación (JWT)
- Generador de reportes (opcional)

### 5.7. Diagrama de Despliegue
- Usuario accede vía navegador
- Backend y Frontend en Railway
- DB en Postgres
- Certificado SSL (https)

---

## Tech Stack

Este proyecto es un monorepo gestionado con pnpm workspaces, dividido en dos aplicaciones principales:

- **`apps/api`**: El backend de la aplicación, construido con **Node.js** y **Express**. Se encarga de toda la lógica de negocio, la comunicación con la base de datos y la exposición de una API REST para el cliente. Utiliza **TypeScript** para un tipado estático y seguro.
- **`apps/client`**: El frontend de la aplicación, desarrollado con **React** y **Vite**. Proporciona la interfaz de usuario con la que interactúan los usuarios finales. También utiliza **TypeScript**.

### Tecnologías Principales

- **Frontend**: React, React Router, Tailwind CSS
- **Backend**: Node.js, Express, TypeORM, Zod
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT (JSON Web Tokens)
- **Despliegue**: Docker y Railway

---
