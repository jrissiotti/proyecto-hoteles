import express, { NextFunction, Request, Response } from 'express'
import { initializeController } from './infraestructura/controllers'
import { ExceptionHandler, IHttpResponse } from './infraestructura/middlewares/ExceptionHandler'
import methodOverride from 'method-override'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './infraestructura/swagger/swagger.config'

const app = express()

// Captura de la excepcion



app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(methodOverride())

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { 
  swaggerOptions: {
    persistAuthorization: true,
  }
}))

/*
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log('En error <---------------------');
  const respError = ExceptionHandler.handle(err as Error);
  return res.status(respError.status).json({
        message: respError.message,
        error: respError.error,
      });
});
*/

// capturar excepciones

// Descargar especificación OpenAPI en JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Content-Disposition', 'attachment; filename="api-docs.json"')
  res.send(swaggerSpec)
})

app.get('/', (req, res) => {
  res.send('Hello World')
})

initializeController(app);

// GET - optener datos
// POST - mandar datos

// PUT - crea o actualiza
// PATCH - actualiza

// DELETE - eliminar

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
  console.log('Swagger API Documentation available at http://localhost:3000/api-docs')
  console.log('Download API spec JSON at http://localhost:3000/api-docs.json')
})