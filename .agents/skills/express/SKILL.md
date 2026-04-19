# Express.js Route Management & Architecture Skill

## Overview

This skill provides comprehensive guidance for building scalable Express.js applications using Clean Architecture principles, implementing proper route management, middleware handling, validation, and exception management.

## Table of Contents

1. [Project Architecture](#project-architecture)
2. [Express Application Setup](#express-application-setup)
3. [Route Management](#route-management)
4. [Controllers & Request Handling](#controllers--request-handling)
5. [Data Transfer Objects (DTOs)](#data-transfer-objects-dtos)
6. [Validation](#validation)
7. [Exception Handling](#exception-handling)
8. [Middleware Usage](#middleware-usage)
9. [Best Practices](#best-practices)

---

## Project Architecture

The project follows **Clean Architecture** with clear separation of concerns:

```
src/
├── index.ts                          # Application entry point
├── aplicacion/                       # Application layer (use cases)
│   ├── casosDeUso/                   # Use cases
│   │   ├── crearHotel.use-case.ts
│   │   ├── obtenerHotel.use-case.ts
│   │   ├── agregarHabitacionSimple.use-case.ts
│   │   └── agregarHabitacionDoble.use-case.ts
│   ├── dtos/                         # Data Transfer Objects
│   │   └── crearHotel.dto.ts
│   └── ports/                        # Interfaces/contracts
│       └── IHotelRepository.ts
├── dominio/                          # Domain layer (business logic)
│   ├── Cliente.ts
│   ├── Habitacion.ts
│   ├── Hotel.ts
│   └── Recerva.ts
└── infraestructura/                  # Infrastructure layer
    ├── controllers/                  # Request handlers
    │   ├── HotelController.ts
    │   └── index.ts
    ├── middlewares/                  # Express middlewares
    │   └── ExceptionHandler.ts
    ├── persistance/                  # Repository implementations
    │   └── hotel.repository.impl.ts
    ├── validations/                  # Input validators
    │   └── id-param.validator.ts
    └── exceptions/                   # Custom exceptions
        ├── DatabaseNotFoudException.ts
        └── ValidationError.ts
```

### Layer Responsibilities

- **Dominio (Domain)**: Business entities and core logic
- **Aplicacion (Application)**: Use cases, DTOs, and interfaces
- **Infraestructura (Infrastructure)**: Controllers, middleware, persistence, validation

---

## Express Application Setup

### Basic Server Configuration

```typescript
import express, { NextFunction, Request, Response } from 'express'
import { initializeController } from './infraestructura/controllers'
import methodOverride from 'method-override'

const app = express()

// Middleware for parsing JSON and URL-encoded data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Override HTTP methods (PUT/PATCH via POST with _method parameter)
app.use(methodOverride())

// Initialize routes
initializeController(app)

// Start server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
```

### Key Configuration Points

| Middleware | Purpose | Use Case |
|-----------|---------|----------|
| `express.json()` | Parse JSON request bodies | REST APIs accepting JSON payloads |
| `express.urlencoded()` | Parse form data | HTML forms with URL-encoded data |
| `methodOverride()` | Allow HTTP method override | Legacy clients or forms via POST |

---

## Route Management

### Route Definition Pattern

Routes are centralized and organized by resource. The pattern is **Resource-based** (HTTP RESTful):

```
[HTTP_METHOD] /[resource]/[id]/[sub-resource]/[action]
```

### Example Routes

```typescript
// Hotel CRUD operations
POST   /hotel                           # Create hotel
GET    /hotel/:id                       # Retrieve specific hotel
PUT    /hotel/:id                       # Update hotel (full)
PATCH  /hotel/:id                       # Update hotel (partial)
DELETE /hotel/:id                       # Delete hotel

// Room management
POST   /hotel/:id/habitacion-simple     # Add simple room
POST   /hotel/:id/habitacion-doble      # Add double room
GET    /hotel/:id/habitaciones          # List rooms

// Reservations
POST   /hotel/:id/reserva               # Create reservation
GET    /hotel/:id/reserva/:reserva-id   # Get reservation
```

### HTTP Methods Reference

| Method | Semantic | Idempotent | Body | Usage |
|--------|----------|-----------|------|-------|
| GET | Retrieve | ✓ | ✗ | Fetch data |
| POST | Create | ✗ | ✓ | Create new resource |
| PUT | Replace | ✓ | ✓ | Full resource replacement |
| PATCH | Partial Update | ✗ | ✓ | Partial updates |
| DELETE | Remove | ✓ | ✗ | Delete resource |

---

## Controllers & Request Handling

### Controller Structure

Controllers are initialized in a centralized location and handle all route definitions:

```typescript
// src/infraestructura/controllers/index.ts
import express from 'express'
import { CrearHotelUseCase } from '../../aplicacion/casosDeUso/crearHotel.use-case'
import { MemoryHotelRepositoryImpl } from '../persistance/hotel.repository.impl'
import { ObtenerHotelUseCase } from '../../aplicacion/casosDeUso/obtenerHotel.use-case'
import { ExceptionHandler } from '../middlewares/ExceptionHandler'
import { IdParamvalidator } from '../validations/id-param.validator'

const memoriHotelRepository = new MemoryHotelRepositoryImpl()

export function initializeController(app: express.Express) {
  // Routes defined here
}
```

### Request Handler Pattern

```typescript
// Pattern: validation → use case → response
app.get('/hotel/:id', (req: express.Request, res: express.Response, next) => {
  const params = req.params as { id: string }
  let respError = undefined
  let hotelData = undefined
  
  try {
    // Step 1: Validate input
    IdParamvalidator.validate(params.id)
    
    // Step 2: Execute use case
    hotelData = new ObtenerHotelUseCase(memoriHotelRepository).execute(params.id)
  } catch(err) {
    // Step 3: Handle exceptions
    respError = ExceptionHandler.handle(err as Error)
  } finally {
    // Step 4: Send response
    if(respError !== undefined) {
      return res.status(respError.status).json({
        message: respError.message,
        error: respError.error,
      })
    } else {
      res.status(200).json(hotelData)
    }
  }
})
```

### Key Handler Patterns

1. **Try-Catch-Finally** for flow control
2. **Validation before execution** to prevent invalid operations
3. **Centralized exception handling** for consistent error responses
4. **Consistent JSON responses** with status codes

---

## Data Transfer Objects (DTOs)

### DTO Purpose

DTOs define the shape of data sent to and from the API. They serve as contracts between client and server.

### DTO Implementation

```typescript
// src/aplicacion/dtos/crearHotel.dto.ts
export interface CrearHotelDto {
  nombre: string
  direccion: string
  estrellas: number
}
```

### DTO Best Practices

✅ **Do:**
- Define DTOs as interfaces for compile-time type checking
- Keep DTOs focused on API contracts only
- Use descriptive property names in Spanish or English (consistent)
- Document required vs optional fields

❌ **Don't:**
- Include sensitive fields (passwords, tokens) in request DTOs
- Mix validation logic inside DTOs
- Use identical names for request and response DTOs if they differ

### Example DTO for Hotel Creation Response

```typescript
// Response DTO (typically includes ID and timestamps)
export interface CrearHotelResponseDto {
  id: string
  nombre: string
  direccion: string
  estrellas: number
  createdAt: Date
}
```

---

## Validation

### Validation Strategy

Validation happens **before** business logic execution to prevent invalid states:

```
Request → Route Params/Body Validation → Use Case Execution → Response
```

### Custom Validator Pattern

```typescript
// src/infraestructura/validations/id-param.validator.ts
import { ValidationException } from "../exceptions/ValidationError"

export class IdParamvalidator {
  static validate(id: string) {
    if(id?.length === 9)
      return true
    else 
      throw new ValidationException('El id no es válido')
  }
}
```

### Validator Implementation Guidelines

1. **Throw exceptions on failure** instead of returning boolean
2. **Provide clear error messages** for debugging
3. **Use static methods** for utility validators
4. **Create specialized validators** for different fields (IdValidator, EmailValidator, etc.)

### Common Validation Scenarios

```typescript
// ID validation
export class IdValidator {
  static validate(id: string) {
    if(!id || id.trim().length === 0)
      throw new ValidationException('ID cannot be empty')
    if(id.length !== 9)
      throw new ValidationException('ID must be 9 characters')
    return true
  }
}

// Email validation
export class EmailValidator {
  static validate(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!emailRegex.test(email))
      throw new ValidationException('Invalid email format')
    return true
  }
}

// Numeric range validation
export class RangeValidator {
  static validate(value: number, min: number, max: number, fieldName: string) {
    if(value < min || value > max)
      throw new ValidationException(
        `${fieldName} must be between ${min} and ${max}`
      )
    return true
  }
}
```

### Applying Validators in Routes

```typescript
app.post('/hotel', (req: express.Request, res: express.Response) => {
  try {
    // Validate DTO fields
    const dto = req.body as CrearHotelDto
    
    // Validate individual fields
    if(!dto.nombre || dto.nombre.trim().length === 0)
      throw new ValidationException('Hotel name is required')
    
    if(dto.estrellas < 1 || dto.estrellas > 5)
      throw new ValidationException('Stars must be between 1 and 5')
    
    // Execute use case
    const respHotel = new CrearHotelUseCase(memoriHotelRepository).execute(dto)
    res.status(201).json(respHotel)
  } catch(err) {
    const respError = ExceptionHandler.handle(err as Error)
    res.status(respError.status).json(respError)
  }
})
```

---

## Exception Handling

### Exception Hierarchy

Create custom exception classes for different error scenarios:

```typescript
// src/infraestructura/exceptions/DatabaseNotFoudException.ts
export class DatabaseNotFoundException extends Error {
  constructor(message: string) {
    super(message)
  }
}

// src/infraestructura/exceptions/ValidationError.ts
export class ValidationException extends Error {
  constructor(message: string) {
    super(message)
  }
}

// Additional custom exceptions
export class DuplicateResourceException extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class UnauthorizedException extends Error {
  constructor(message: string) {
    super(message)
  }
}
```

### Exception Handler

The `ExceptionHandler` maps custom exceptions to appropriate HTTP status codes:

```typescript
// src/infraestructura/middlewares/ExceptionHandler.ts
export interface IHttpResponse {
  error: boolean
  message: string
  status: number
}

export class ExceptionHandler {
  public static handle(err: Error): IHttpResponse {
    if(err instanceof DatabaseNotFoundException) {
      return {
        error: true,
        message: err.message,
        status: 404, // Not Found
      }
    } else if(err instanceof ValidationException) {
      return {
        error: true,
        message: err.message,
        status: 406, // Not Acceptable
      }
    } else if(err instanceof DuplicateResourceException) {
      return {
        error: true,
        message: err.message,
        status: 409, // Conflict
      }
    } else if(err instanceof UnauthorizedException) {
      return {
        error: true,
        message: err.message,
        status: 401, // Unauthorized
      }
    } else {
      return {
        error: true,
        message: 'Internal Server Error',
        status: 500, // Internal Server Error
      }
    }
  }
}
```

### HTTP Status Code Mapping

| Code | Exception | Meaning |
|------|-----------|---------|
| 200 | - | Success |
| 201 | - | Created |
| 400 | - | Bad Request (malformed) |
| 401 | UnauthorizedException | Authentication required |
| 403 | ForbiddenException | Access denied |
| 404 | DatabaseNotFoundException | Resource not found |
| 406 | ValidationException | Validation failed |
| 409 | DuplicateResourceException | Resource already exists |
| 500 | Error | Unexpected server error |

### Throwing Exceptions in Use Cases

```typescript
// src/aplicacion/casosDeUso/obtenerHotel.use-case.ts
import { DatabaseNotFoundException } from '../../infraestructura/exceptions/DatabaseNotFoudException'

export class ObtenerHotelUseCase {
  constructor(private hotelRepository: IHotelRepository) {}
  
  execute(id: string): Hotel {
    const hotel = this.hotelRepository.findById(id)
    
    if(!hotel) {
      throw new DatabaseNotFoundException(`Hotel with ID ${id} not found`)
    }
    
    return hotel
  }
}
```

---

## Middleware Usage

### Middleware Function Signature

```typescript
(req: Request, res: Response, next?: NextFunction) => void | Promise<void>
```

### Built-in Express Middlewares Used

1. **express.json()** - Parse JSON request bodies
2. **express.urlencoded()** - Parse form data
3. **methodOverride()** - Allow HTTP method override

### Custom Middleware Pattern

```typescript
// Example: Logging middleware
export function loggerMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
}

// Apply middleware
app.use(loggerMiddleware)
```

### Error Handling Middleware

```typescript
// Apply error handling at the end of all routes
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err)
  const respError = ExceptionHandler.handle(err)
  return res.status(respError.status).json({
    message: respError.message,
    error: respError.error,
  })
})
```

### Middleware Execution Order

```typescript
app.use(express.json())           // Parse JSON first
app.use(express.urlencoded())     // Parse forms
app.use(methodOverride())         // Allow method override

// Routes (executed next)
initializeController(app)

// Error handling (execute last)
app.use(errorHandlingMiddleware)
```

---

## Best Practices

### 1. Route Organization

✅ **Do:**
```typescript
// Group related routes together
app.post('/hotel', createHotelHandler)
app.get('/hotel/:id', getHotelHandler)
app.put('/hotel/:id', updateHotelHandler)
app.delete('/hotel/:id', deleteHotelHandler)

// Use separate functions for readability
function createHotelHandler(req, res) { }
function getHotelHandler(req, res) { }
```

❌ **Don't:**
```typescript
// Avoid deeply nested routes without clear hierarchy
app.get('/h/:id/hb/:bid/r/:rid', getReservationHandler)
```

### 2. Consistent Response Format

Always return consistent response structures:

```typescript
// Success response
{
  "id": "123456789",
  "nombre": "Hotel Central",
  "direccion": "Calle Principal 123",
  "estrellas": 4
}

// Error response
{
  "error": true,
  "message": "Invalid hotel ID",
  "status": 406
}
```

### 3. Use Dependency Injection

```typescript
// Good: Inject dependencies
export function initializeController(app: express.Express) {
  const repository = new MemoryHotelRepositoryImpl()
  const useCase = new CrearHotelUseCase(repository)
  
  app.post('/hotel', (req, res) => {
    const result = useCase.execute(req.body)
    res.json(result)
  })
}

// Better: Create factory or service container
class ServiceContainer {
  private repository = new MemoryHotelRepositoryImpl()
  
  getCrearHotelUseCase() {
    return new CrearHotelUseCase(this.repository)
  }
}
```

### 4. Input Validation Before Processing

```typescript
// Always validate before execution
app.post('/hotel', (req, res) => {
  try {
    // 1. Validate input
    const dto = validateCrearHotelDto(req.body)
    
    // 2. Execute business logic
    const result = new CrearHotelUseCase(repo).execute(dto)
    
    // 3. Send response
    res.status(201).json(result)
  } catch(err) {
    handleError(err, res)
  }
})
```

### 5. Type Safety

```typescript
// Always type request parameters and body
app.get('/hotel/:id', (req: express.Request, res: express.Response) => {
  const params = req.params as { id: string }
  const body = req.body as CrearHotelDto
  // ...
})
```

### 6. Proper HTTP Status Codes

```typescript
// Create (POST)
res.status(201).json(result)  // 201 Created

// Retrieve (GET)
res.status(200).json(result)  // 200 OK

// Validation error
res.status(406).json(error)   // 406 Not Acceptable

// Not found
res.status(404).json(error)   // 404 Not Found

// Server error
res.status(500).json(error)   // 500 Internal Server Error
```

### 7. Avoid Blocking Operations

```typescript
// Good: Use async handlers
app.get('/hotel/:id', async (req, res) => {
  try {
    const hotel = await hotelRepository.findByIdAsync(req.params.id)
    res.json(hotel)
  } catch(err) {
    handleError(err, res)
  }
})
```

### 8. Security Considerations

✅ **Do:**
- Validate all user inputs
- Don't expose sensitive information in error messages
- Use HTTPS in production
- Implement rate limiting
- Sanitize user inputs

❌ **Don't:**
```typescript
// DON'T: Expose sensitive details
catch(err) {
  res.status(500).json({ 
    message: err.message,      // Exposes internal details
    stack: err.stack           // Exposes stack trace
  })
}

// DO: Generic error messages
catch(err) {
  res.status(500).json({ 
    message: 'An error occurred' // Generic message
  })
}
```

---

## Complete Example: Hotel API

### Full Route Implementation

```typescript
import express from 'express'
import { CrearHotelUseCase } from '../../aplicacion/casosDeUso/crearHotel.use-case'
import { ObtenerHotelUseCase } from '../../aplicacion/casosDeUso/obtenerHotel.use-case'
import { MemoryHotelRepositoryImpl } from '../persistance/hotel.repository.impl'
import { ExceptionHandler } from '../middlewares/ExceptionHandler'
import { IdParamvalidator } from '../validations/id-param.validator'

const repository = new MemoryHotelRepositoryImpl()

export function initializeController(app: express.Express) {
  
  // POST /hotel - Create hotel
  app.post('/hotel', (req: express.Request, res: express.Response) => {
    try {
      const dto = req.body
      const hotel = new CrearHotelUseCase(repository).execute(dto)
      res.status(201).json(hotel)
    } catch(err) {
      const error = ExceptionHandler.handle(err as Error)
      res.status(error.status).json(error)
    }
  })
  
  // GET /hotel/:id - Get hotel by ID
  app.get('/hotel/:id', (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params
      IdParamvalidator.validate(id)
      const hotel = new ObtenerHotelUseCase(repository).execute(id)
      res.status(200).json(hotel)
    } catch(err) {
      const error = ExceptionHandler.handle(err as Error)
      res.status(error.status).json(error)
    }
  })
  
  // POST /hotel/:id/habitacion-simple - Add simple room
  app.post('/hotel/:id/habitacion-simple', (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params
      IdParamvalidator.validate(id)
      // Implementation here
      res.status(201).json({ message: 'Simple room added' })
    } catch(err) {
      const error = ExceptionHandler.handle(err as Error)
      res.status(error.status).json(error)
    }
  })
  
  // POST /hotel/:id/habitacion-doble - Add double room
  app.post('/hotel/:id/habitacion-doble', (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params
      IdParamvalidator.validate(id)
      // Implementation here
      res.status(201).json({ message: 'Double room added' })
    } catch(err) {
      const error = ExceptionHandler.handle(err as Error)
      res.status(error.status).json(error)
    }
  })
}
```

---

## Testing Routes

### Using REST Client (test.http)

```http
### Create Hotel
POST http://localhost:3000/hotel
Content-Type: application/json

{
  "nombre": "Hotel Central",
  "direccion": "Calle Principal 123",
  "estrellas": 4
}

### Get Hotel
GET http://localhost:3000/hotel/123456789
Content-Type: application/json

### Add Simple Room
POST http://localhost:3000/hotel/123456789/habitacion-simple
Content-Type: application/json

{
  "numero": "101",
  "precio": 50
}
```

---

## Summary

This skill provides a comprehensive approach to building Express.js applications with:

- ✅ Clear architectural separation of concerns
- ✅ Robust route management and organization
- ✅ Proper validation and exception handling
- ✅ Type-safe request/response handling
- ✅ Middleware usage for cross-cutting concerns
- ✅ Best practices for scalability and maintainability

Follow these patterns to ensure consistent, maintainable, and robust Express.js applications.
