import { Cliente } from "./Cliente";
import { Habitacion } from "./Habitacion";

export class Reserva {
  private _estado: string = "pendiente"; // pendiente, confirmada, cancelada, finalizada
  constructor(
    private cliente: Cliente,
    private habitacion: Habitacion,
    private _fechaEntrada: Date,
    private _fechaSalida: Date,
  ) {}

  public get fechaEntrada(): Date {
    return this._fechaEntrada;
  }

  public get fechaSalida(): Date {
    return this._fechaSalida;
  }

  public cancelarReserva() {
    this._estado = "cancelada";
  }

  public finalizarReserva() {
    this._estado = "finalizada";
  }

  public estaActivo(): boolean {
    return this._estado === "confirmada" || this._estado === "pendiente";
  }
}