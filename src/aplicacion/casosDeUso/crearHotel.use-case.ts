import { Hotel } from "../../dominio/Hotel";
import { CrearHotelDto } from "../dtos/crearHotel.dto";
import { IHotelRepository } from "../ports/IHotelRepository";

export class CrearHotelUseCase {
    constructor(private hotelRepository: IHotelRepository){}
    execute(dataHotel: CrearHotelDto) {
        const hotel = new Hotel(null, dataHotel.nombre, dataHotel.direccion, dataHotel.estrellas);
        return this.hotelRepository.crearHotel(hotel);
    }
}