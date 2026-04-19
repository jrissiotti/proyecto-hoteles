import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Hotel Management',
      version: '1.0.0',
      description: 'API para gestionar hoteles, habitaciones y reservas',
      contact: {
        name: 'API Support',
        email: 'support@hotelapi.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Hotel: {
          type: 'object',
          required: ['nombre', 'direccion', 'estrellas'],
          properties: {
            id: {
              type: 'string',
              description: 'ID único del hotel',
              example: 'uuid-1234-5678',
            },
            nombre: {
              type: 'string',
              description: 'Nombre del hotel',
              example: 'Hotel Grand Palace',
            },
            direccion: {
              type: 'string',
              description: 'Dirección del hotel',
              example: 'Calle Principal 123, Ciudad',
            },
            estrellas: {
              type: 'number',
              description: 'Clasificación de estrellas',
              example: 5,
              minimum: 1,
              maximum: 5,
            },
            habitaciones: {
              type: 'array',
              description: 'Lista de habitaciones del hotel',
              items: {
                type: 'object',
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
            },
            error: {
              type: 'string',
            },
          },
        },
        HabitacionSimple: {
          type: 'object',
          required: ['numeroHabitacion', 'precio'],
          properties: {
            numeroHabitacion: {
              type: 'number',
              description: 'Número de la habitación',
              example: 101,
            },
            precio: {
              type: 'number',
              description: 'Precio base de la habitación simple',
              example: 50.00,
            },
          },
        },
      },
    },
  },
  apis: ['./src/infraestructura/controllers/index.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
