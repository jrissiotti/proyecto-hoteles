import { Request, Response } from 'express';
import { AgregarHabitacionDobleUseCase } from '../../aplicacion/casosDeUso/agregarHabitacionDoble.use-case';
import { FiltrarHabitacionesDisponiblesUseCase } from '../../aplicacion/casosDeUso/filtrarHabitacionesDisponibles.use-case';
import { ExceptionHandler } from '../middlewares/ExceptionHandler';

export class HotelController {
    constructor(
        private agregarHabitacionDobleUC: AgregarHabitacionDobleUseCase,
        private filtrarHabitacionesUC: FiltrarHabitacionesDisponiblesUseCase
    ) {}

    agregarHabitacionDoble = (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const { numeroHabitacion, precio } = req.body;
            
            // Se ejecuta de forma secuencial
            const hotel = this.agregarHabitacionDobleUC.execute(id, { numeroHabitacion, precio });
            
            res.status(201).json(hotel);
        } catch (error) {
            const result = ExceptionHandler.handle(error as Error);
            res.status(result.status).json(result);
        }
    }

    filtrarDisponibles = (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const capacidad = req.query.capacidad as string;
            const fechaInicio = req.query.fechaInicio as string;
            const fechaFin = req.query.fechaFin as string;
            
            const habitaciones = this.filtrarHabitacionesUC.execute(
                id, 
                Number(capacidad), 
                fechaInicio, 
                fechaFin
            );
            
            res.status(200).json(habitaciones);
        } catch (error) {
            const result = ExceptionHandler.handle(error as Error);
            res.status(result.status).json(result);
        }
    }
}