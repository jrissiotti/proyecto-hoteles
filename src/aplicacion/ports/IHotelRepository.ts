import { Hotel } from "../../dominio/Hotel"

export interface IHotelRepository {
    crearHotel(hotel: Hotel): Hotel;
    obtenerHotel(id: string): Hotel;
    actualizar(hotel: Hotel): void; 
}