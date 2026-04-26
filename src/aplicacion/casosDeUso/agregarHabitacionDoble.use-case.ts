import { HabitacionDoble, Habitacion } from "../../dominio/Habitacion";
import { IHotelRepository } from "../ports/IHotelRepository";
import { DatabaseNotFoundException } from "../../infraestructura/exceptions/DatabaseNotFoudException";
import { BusinessRuleException } from "../../infraestructura/exceptions/BusinessRuleException";

export class AgregarHabitacionDobleUseCase {
    constructor(private hotelRepository: IHotelRepository) {}

    execute(hotelId: string, habitacionData: {numeroHabitacion: number, precio: number}) {
        const hotel = this.hotelRepository.obtenerHotel(hotelId);
        
        if (!hotel) {
            throw new DatabaseNotFoundException(`Hotel con ID ${hotelId} no encontrado`);
        }

        // Buscamos si ya existe la habitación, especificando que h es de tipo Habitacion
        const existe = hotel.getHabitaciones().find((h: Habitacion) => h.numero === habitacionData.numeroHabitacion);
        
        if (existe) {
            throw new BusinessRuleException(`La habitación ${habitacionData.numeroHabitacion} ya existe en este hotel`);
        }

        hotel.agregarHabitacion(new HabitacionDoble(habitacionData.numeroHabitacion, habitacionData.precio));
        this.hotelRepository.actualizar(hotel); 
        
        return hotel;
    }
}