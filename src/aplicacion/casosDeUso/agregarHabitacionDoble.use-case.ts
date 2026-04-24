import { HabitacionDoble } from "../../dominio/Habitacion";
import { IHotelRepository } from "../ports/IHotelRepository";
import { DatabaseNotFoundException } from "../../infraestructura/exceptions/DatabaseNotFoudException";

export class AgregarHabitacionDobleUseCase {
    constructor(private hotelRepository: IHotelRepository) {}

    execute(hotelId: string, habitacionData: {numeroHabitacion: number, precio: number}) {
        const hotel = this.hotelRepository.obtenerHotel(hotelId);
        
        if (!hotel) {
            throw new DatabaseNotFoundException(`Hotel con ID ${hotelId} no encontrado`);
}


        hotel.agregarHabitacion(new HabitacionDoble(habitacionData.numeroHabitacion, habitacionData.precio));
        this.hotelRepository.actualizar(hotel); 
        
        return hotel;
    }
}