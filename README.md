# Proyecto Hoteles

API REST para gestionar hoteles y habitaciones, implementada con Express + TypeScript y organizada con enfoque de arquitectura por capas (dominio, aplicación e infraestructura).

## Requisitos

- Node.js 20 o superior
- npm 10 o superior

## Inicialización rápida

1. Instalar dependencias:

```bash
npm install
```

2. Compilar TypeScript a JavaScript:

```bash
npx tsc --outDir dist --rootDir src --module commonjs --target ES2020 --esModuleInterop
```

3. Ejecutar servidor:

```bash
node dist/index.js
```

4. Verificar en navegador o cliente HTTP:

- API base: http://localhost:3000/
- Swagger UI: http://localhost:3000/api-docs
- OpenAPI JSON: http://localhost:3000/api-docs.json

## Flujo recomendado de trabajo

Cada vez que cambies código TypeScript:

1. Vuelve a compilar:

```bash
npx tsc --outDir dist --rootDir src --module commonjs --target ES2020 --esModuleInterop
```

2. Reinicia el servidor:

```bash
node dist/index.js
```

## Endpoints principales

### Health/Home

- GET /  
  Respuesta esperada: Hello World

### Hoteles

- POST /hotel  
  Crea un hotel.

Body de ejemplo:

```json
{
  "nombre": "Hotel Grand Palace",
  "direccion": "Calle Principal 123",
  "estrellas": 5
}
```

- GET /hotel/:id  
  Obtiene un hotel por su ID.

### Habitaciones

- POST /hotel/:id/habitacion-simple  
  Agrega una habitación simple a un hotel.

Body de ejemplo:

```json
{
  "numeroHabitacion": 101,
  "precio": 250
}
```

## Estructura del proyecto

```text
src/
  index.ts
  aplicacion/
    casosDeUso/
    dtos/
    ports/
  dominio/
  infraestructura/
    controllers/
    exceptions/
    middlewares/
    persistance/
    swagger/
    validations/
```

## Pruebas manuales

Puedes usar el archivo test.http para ejecutar requests desde VS Code (extensión REST Client) o copiar los ejemplos de este README en Postman/Insomnia.

## Estado actual del proyecto

- Persistencia en memoria (no base de datos).
- No hay suite de tests automatizados configurada todavía.
- Script npm de test aún no implementado.

## Próximos pasos sugeridos

- Agregar un tsconfig.json para simplificar compilación.
- Crear scripts npm para desarrollo y producción.
- Incorporar pruebas unitarias y de integración.
