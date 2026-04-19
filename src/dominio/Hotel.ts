import { Habitacion } from "./Habitacion";

export class Hotel {
  private habitaciones: Habitacion[] = [];
  // private reservas: Reserva[] = [];
  // private clientes: Cliente[] = [];
  constructor(
    private id: string | null,
    private _nombre: string,
    private direccion: string,
    private estrellas: number,
  ) {
    if(this.id=== null) {
      this.id = new Date().getTime().toString(32)
    }
  }

  public getId() {
    return this.id;
  }

  public get nombre(): string {
    return this._nombre;
  }

  agregarHabitacion(habitacion: Habitacion) {
    this.habitaciones.push(habitacion);
    habitacion.agregarHotel(this);
  }

  filtrarHabitacionesDisponibles(
    capacidad: number,
    fechaInicio: Date,
    fechaFin: Date,
  ): Habitacion[] {
    return this.habitaciones.filter(
      (h) => h.disponible(fechaInicio, fechaFin) && h.capacidad >= capacidad,
    );
  }
}