import { IHotelRepository } from "../../aplicacion/ports/IHotelRepository";
import { Hotel } from "../../dominio/Hotel";
import { DatabaseNotFoundException } from "../exceptions/DatabaseNotFoudException";

export class MemoryHotelRepositoryImpl implements IHotelRepository {
    public readonly hoteles: Hotel[];

    constructor() {
        this.hoteles = [];
    }

    crearHotel(hotel: Hotel): Hotel {
        this.hoteles.push(hotel);
        return hotel;
    }

    obtenerHotel(id: string): Hotel {
        const hotel = this.hoteles.find(el => el.getId() === id );
        if(hotel === undefined)
            throw new DatabaseNotFoundException('Hotel no encontrado')
        return hotel;  
    }
    actualizar(hotel: Hotel): void {
        const index = this.hoteles.findIndex(h => h.getId() === hotel.getId());
        if (index === -1) {
            throw new DatabaseNotFoundException('No se puede actualizar: Hotel no encontrado');
        }
        this.hoteles[index] = hotel;
    }

}