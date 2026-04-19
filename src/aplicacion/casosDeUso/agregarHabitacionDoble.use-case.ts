import { HabitacionDoble } from "../../dominio/Habitacion";
import { Hotel } from "../../dominio/Hotel";

export class agregarHabitacionDobleUseCase {
    execute(hotel: Hotel, habitacionData: {numeroHabitacion: number, precio: number}) {
        hotel.agregarHabitacion(new HabitacionDoble(habitacionData.numeroHabitacion, habitacionData.precio));
    }
}