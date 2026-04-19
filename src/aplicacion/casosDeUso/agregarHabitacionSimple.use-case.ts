import { HabitacionSimple } from "../../dominio/Habitacion";
import { Hotel } from "../../dominio/Hotel";

export class agregarHabitacionSimpleUseCase {
    execute(hotel: Hotel, habitacionData: {numeroHabitacion: number, precio: number}) {
        hotel.agregarHabitacion(new HabitacionSimple(habitacionData.numeroHabitacion, habitacionData.precio));
    }
}