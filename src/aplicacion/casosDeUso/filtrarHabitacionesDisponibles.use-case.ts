import { IHotelRepository } from "../ports/IHotelRepository";
import { DatabaseNotFoundException } from "../../infraestructura/exceptions/DatabaseNotFoudException";

export class FiltrarHabitacionesDisponiblesUseCase {
    constructor(private hotelRepository: IHotelRepository) {}

    execute(hotelId: string, capacidad: number, fechaInicio: string, fechaFin: string) {
        const hotel = this.hotelRepository.obtenerHotel(hotelId);
        
        if (!hotel) {
            throw new DatabaseNotFoundException(`Hotel con ID ${hotelId} no encontrado`);
}

        return hotel.filtrarHabitacionesDisponibles(
            capacidad, 
            new Date(fechaInicio), 
            new Date(fechaFin)
        );
    }
}