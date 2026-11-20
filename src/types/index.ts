export type Libro = {
  isbn: string; // 13 dígitos, sin guiones
  titulo: string;
  autor: string;
  anio: number;
  ejemplares: number; // ejemplares en el estante al iniciar la app
};

export type Prestamo = {
  isbn: string;
  titulo: string;
  autor: string;
  fechaPrestamo: string;
  fechaDevolucion: string;
  recordatorioActivo: boolean;
  notificacionId?: string;
};

export type ReservaEspera = {
  isbn: string;
  titulo: string;
  autor: string;
  posicion: number;
  fechaSolicitud: string;
  esMio: boolean;
};

export type PermisoEstado = 'cargando' | 'concedido' | 'preguntable' | 'bloqueado';

export type UsuarioSesion = {
  usuario: string;
  nombre: string;
};
