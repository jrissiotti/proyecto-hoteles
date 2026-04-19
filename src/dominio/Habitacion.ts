import { Cliente } from "./Cliente";
import { Hotel } from "./Hotel";
import { Reserva } from "./Recerva";

export abstract class Habitacion {
  private _hotel: Hotel | null = null;
  private _reservas: Reserva[] = []; // historial de reservas

  constructor(
    private numero: number,
    private precioBase: number,
    private _capacidad: number = 1,
  ) {}

  public disponible(fechaInicio: Date, fechaFin: Date): boolean {
    const reservaEnFechas = this._reservas.filter(el => el.estaActivo()).find((reserva) => {
      return (
        (fechaInicio >= reserva.fechaEntrada &&
          fechaInicio < reserva.fechaSalida) ||
        (fechaFin > reserva.fechaEntrada && fechaFin <= reserva.fechaSalida) ||
        (fechaInicio <= reserva.fechaEntrada && fechaFin >= reserva.fechaSalida)
      );
    });
    return !reservaEnFechas;
  }

  public get capacidad(): number {
    return this._capacidad;
  }

  public agregarHotel(hotel: Hotel) {
    if (this._hotel) {
      throw new Error(
        `La habitación ${this.numero} ya pertenece al hotel ${this._hotel.nombre}.`,
      );
    }
    this._hotel = hotel;
  }

  public reservar(cliente: Cliente, fechaEntrada: Date, fechaSalida: Date) {
    if (!this.disponible(fechaEntrada, fechaSalida)) {
      throw new Error(`La habitación ${this.numero} no está disponible.`);
    }

    const reserva = new Reserva(cliente, this, fechaEntrada, fechaSalida);
    this._reservas.push(reserva);
    // this._disponible = false;
  }

  /**
   * Personaliza la serialización JSON para evitar referencias circulares
   * Excluye la referencia de vuelta a Hotel (_hotel)
   */
  public toJSON() {
    return {
      numero: this.numero,
      precioBase: this.precioBase,
      capacidad: this._capacidad,
      reservas: this._reservas,
    };
  }
}


export class HabitacionSimple extends Habitacion {
  constructor(numero: number, precioBase: number) {
    super(numero, precioBase, 1);
  }
}

export class HabitacionDoble extends Habitacion {
  constructor(numero: number, precioBase: number) {
    super(numero, precioBase, 2);
  }
}

export class HabitacionSuite extends Habitacion {
  constructor(
    numero: number,
    precioBase: number,
    private tieneBalcon: boolean,
    private tieneJacuzzi: boolean,
  ) {
    super(numero, precioBase, 4);
  }
}

export class HabitacionFamiliar extends Habitacion {
  constructor(
    numero: number,
    precioBase: number,
    private camasExtras: number,
  ) {
    super(numero, precioBase, 2 + camasExtras);
  }
}