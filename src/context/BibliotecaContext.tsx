import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Pila } from '../estructuras/Pila';
import { Cola } from '../estructuras/Cola';
import { LIBROS, LISTAS_ESPERA_INICIALES } from '../data/libros';
import type { Libro, Prestamo, ReservaEspera, UsuarioSesion } from '../types';
import {
  programarRecordatorioDevolucion,
  cancelarRecordatorio,
  notificarLibroDisponible,
} from '../lib/notificaciones';

const STORAGE_PRESTAMOS = '@biblioteca_prestamos';
const STORAGE_RECIENTES = '@biblioteca_recientes';
const STORAGE_NOTIF_IDS = '@biblioteca_notif_ids';

export const NOMBRE_USUARIO_ALUMNO = 'Felipe Monzón (Yo)';

interface ResultadoReserva {
  exito: boolean;
  esPrestamo: boolean;
  posicion?: number;
  mensaje: string;
}

interface BibliotecaContextValor {
  prestamos: Prestamo[];
  reservasEnEspera: ReservaEspera[];
  recientes: Libro[];
  avisosEnApp: string[];
  usuario: UsuarioSesion | null;
  agregarReciente: (libro: Libro) => void;
  reservarLibro: (isbn: string) => ResultadoReserva;
  devolverLibro: (isbn: string) => Promise<void>;
  alternarRecordatorio: (isbn: string, activar: boolean) => Promise<boolean>;
  entregarAlSiguiente: (isbn: string) => Promise<void>;
  iniciarSesion: (usuario: string, clave: string) => boolean;
  cerrarSesion: () => void;
  eliminarAviso: (indice: number) => void;
  obtenerEjemplaresDisponibles: (isbn: string) => number;
  obtenerPersonasEnEspera: (isbn: string) => number;
  estaPrestadoOReservado: (isbn: string) => boolean;
  obtenerColaLibro: (isbn: string) => string[];
}

const BibliotecaContext = createContext<BibliotecaContextValor | undefined>(
  undefined,
);

export function BibliotecaProvider({ children }: { children: ReactNode }) {
  // 1. Vistos recientemente (Pila)
  const [pilaRecientes, setPilaRecientes] = useState<Pila<Libro>>(
    () => new Pila<Libro>(),
  );

  // 2. Préstamos activos
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);

  // 3. Listas de espera por ISBN (Cola por libro)
  const [colasEspera, setColasEspera] = useState<Record<string, Cola<string>>>(
    () => {
      const mapa: Record<string, Cola<string>> = {};
      LIBROS.forEach((libro) => {
        const iniciales = LISTAS_ESPERA_INICIALES[libro.isbn] || [];
        mapa[libro.isbn] = new Cola<string>(iniciales);
      });
      return mapa;
    },
  );

  // 4. Avisos dentro de la app (cuando no hay permiso de notificaciones)
  const [avisosEnApp, setAvisosEnApp] = useState<string[]>([]);

  // 5. Sesión del personal
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);

  // Cargar persistencia al inicio
  useEffect(() => {
    async function cargarDatosPersistidos() {
      try {
        const prestamosGuardados =
          await AsyncStorage.getItem(STORAGE_PRESTAMOS);
        if (prestamosGuardados) {
          setPrestamos(JSON.parse(prestamosGuardados));
        }

        const recientesGuardados =
          await AsyncStorage.getItem(STORAGE_RECIENTES);
        if (recientesGuardados) {
          const librosArray: Libro[] = JSON.parse(recientesGuardados);
          setPilaRecientes(new Pila<Libro>(librosArray));
        }
      } catch {
        // En caso de fallo de lectura, se mantienen los valores iniciales
      }
    }

    cargarDatosPersistidos();
  }, []);

  // Guardar préstamos cada vez que cambien
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_PRESTAMOS, JSON.stringify(prestamos)).catch(
      () => {},
    );
  }, [prestamos]);

  // Guardar recientes cada vez que cambien
  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_RECIENTES,
      JSON.stringify(pilaRecientes.aArray()),
    ).catch(() => {});
  }, [pilaRecientes]);

  // Cálculo derivado de ejemplares disponibles (sin duplicar estado)
  const obtenerEjemplaresDisponibles = useCallback(
    (isbn: string): number => {
      const libro = LIBROS.find((l) => l.isbn === isbn);
      if (!libro) return 0;
      const prestados = prestamos.filter((p) => p.isbn === isbn).length;
      return Math.max(0, libro.ejemplares - prestados);
    },
    [prestamos],
  );

  const obtenerPersonasEnEspera = useCallback(
    (isbn: string): number => {
      const cola = colasEspera[isbn];
      return cola ? cola.tamanio : 0;
    },
    [colasEspera],
  );

  const obtenerColaLibro = useCallback(
    (isbn: string): string[] => {
      const cola = colasEspera[isbn];
      return cola ? cola.aArray() : [];
    },
    [colasEspera],
  );

  const estaPrestadoOReservado = useCallback(
    (isbn: string): boolean => {
      const prestado = prestamos.some((p) => p.isbn === isbn);
      if (prestado) return true;
      const cola = colasEspera[isbn];
      if (cola) {
        return cola.aArray().includes(NOMBRE_USUARIO_ALUMNO);
      }
      return false;
    },
    [prestamos, colasEspera],
  );

  // Agregar a vistos recientemente (Pila LIFO)
  const agregarReciente = useCallback((libro: Libro) => {
    setPilaRecientes((prevPila) => {
      // Si el libro ya está en el tope, no se apila de nuevo (Requisito A3 #2)
      if (prevPila.tope()?.isbn === libro.isbn) {
        return prevPila;
      }
      const nuevaPila = new Pila<Libro>(prevPila.aArray());
      nuevaPila.push(libro);
      return nuevaPila;
    });
  }, []);

  // Reservar libro (préstamo si hay ejemplares, o encolar si no hay)
  const reservarLibro = useCallback(
    (isbn: string): ResultadoReserva => {
      const libro = LIBROS.find((l) => l.isbn === isbn);
      if (!libro) {
        return {
          exito: false,
          esPrestamo: false,
          mensaje: 'El libro solicitado no existe en el catálogo.',
        };
      }

      if (estaPrestadoOReservado(isbn)) {
        return {
          exito: false,
          esPrestamo: false,
          mensaje: 'Ya tenés un préstamo o una reserva activa de este libro.',
        };
      }

      const disponibles = obtenerEjemplaresDisponibles(isbn);

      if (disponibles > 0) {
        // Se convierte en préstamo por 7 días
        const ahora = new Date();
        const devolucion = new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000);

        const nuevoPrestamo: Prestamo = {
          isbn: libro.isbn,
          titulo: libro.titulo,
          autor: libro.autor,
          fechaPrestamo: ahora.toLocaleDateString('es-AR'),
          fechaDevolucion: devolucion.toLocaleDateString('es-AR'),
          recordatorioActivo: false,
        };

        setPrestamos((prev) => [...prev, nuevoPrestamo]);

        return {
          exito: true,
          esPrestamo: true,
          mensaje:
            '¡Préstamo confirmado! Tenés 7 días para disfrutar de tu libro.',
        };
      } else {
        // Se encola en la lista de espera
        let nuevaPosicion = 1;
        setColasEspera((prevColas) => {
          const colaExistente =
            prevColas[isbn] || new Cola<string>(LISTAS_ESPERA_INICIALES[isbn]);
          const nuevaCola = new Cola<string>(colaExistente.aArray());
          nuevaCola.encolar(NOMBRE_USUARIO_ALUMNO);
          nuevaPosicion = nuevaCola.tamanio;

          return {
            ...prevColas,
            [isbn]: nuevaCola,
          };
        });

        return {
          exito: true,
          esPrestamo: false,
          posicion: nuevaPosicion,
          mensaje: `Ingresaste a la lista de espera en la posición #${nuevaPosicion}.`,
        };
      }
    },
    [estaPrestadoOReservado, obtenerEjemplaresDisponibles],
  );

  // Devolver un libro
  const devolverLibro = useCallback(
    async (isbn: string) => {
      const prestamo = prestamos.find((p) => p.isbn === isbn);
      if (prestamo?.notificacionId) {
        await cancelarRecordatorio(prestamo.notificacionId);
      }

      setPrestamos((prev) => prev.filter((p) => p.isbn !== isbn));
    },
    [prestamos],
  );

  // Activar o desactivar recordatorio
  const alternarRecordatorio = useCallback(
    async (isbn: string, activar: boolean): Promise<boolean> => {
      const prestamo = prestamos.find((p) => p.isbn === isbn);
      if (!prestamo) return false;

      if (!activar) {
        if (prestamo.notificacionId) {
          await cancelarRecordatorio(prestamo.notificacionId);
        }
        setPrestamos((prev) =>
          prev.map((p) =>
            p.isbn === isbn
              ? { ...p, recordatorioActivo: false, notificacionId: undefined }
              : p,
          ),
        );
        return true;
      }

      // Pedir permiso de notificaciones únicamente al activar el interruptor
      const permisos = await Notifications.getPermissionsAsync();
      let concedido = permisos.granted;

      if (!concedido) {
        const nuevoPermiso = await Notifications.requestPermissionsAsync();
        concedido = nuevoPermiso.granted;
      }

      if (!concedido) {
        return false;
      }

      try {
        const notifId = await programarRecordatorioDevolucion(prestamo.titulo);
        setPrestamos((prev) =>
          prev.map((p) =>
            p.isbn === isbn
              ? { ...p, recordatorioActivo: true, notificacionId: notifId }
              : p,
          ),
        );
        return true;
      } catch {
        return false;
      }
    },
    [prestamos],
  );

  // Personal: Entregar al siguiente de la lista de espera
  const entregarAlSiguiente = useCallback(
    async (isbn: string) => {
      const cola = colasEspera[isbn];
      if (!cola || cola.estaVacia()) return;

      const libro = LIBROS.find((l) => l.isbn === isbn);
      const tituloLibro = libro ? libro.titulo : 'el libro solicitado';

      let personaFrente: string | undefined;

      setColasEspera((prevColas) => {
        const colaActual = prevColas[isbn];
        const nuevaCola = new Cola<string>(colaActual.aArray());
        personaFrente = nuevaCola.desencolar();

        return {
          ...prevColas,
          [isbn]: nuevaCola,
        };
      });

      // Si esa persona sos vos (el alumno), notificar
      if (personaFrente === NOMBRE_USUARIO_ALUMNO) {
        const perm = await Notifications.getPermissionsAsync();
        if (perm.granted) {
          await notificarLibroDisponible(tituloLibro);
        } else {
          setAvisosEnApp((prev) => [
            ...prev,
            `¡"${tituloLibro}" ya está listo para retirar en el mostrador!`,
          ]);
        }
      }
    },
    [colasEspera],
  );

  // Autenticación de personal
  const iniciarSesion = useCallback(
    (usuarioInput: string, claveInput: string): boolean => {
      if (usuarioInput.trim() === 'admin' && claveInput === '1234') {
        setUsuario({
          usuario: 'admin',
          nombre: 'Bibliotecario IPF',
        });
        return true;
      }
      return false;
    },
    [],
  );

  const cerrarSesion = useCallback(() => {
    setUsuario(null);
  }, []);

  const eliminarAviso = useCallback((indice: number) => {
    setAvisosEnApp((prev) => prev.filter((_, i) => i !== indice));
  }, []);

  // Lista de reservas en espera del usuario alumno
  const reservasEnEspera = useMemo<ReservaEspera[]>(() => {
    const lista: ReservaEspera[] = [];
    Object.entries(colasEspera).forEach(([isbn, cola]) => {
      const arr = cola.aArray();
      const pos = arr.indexOf(NOMBRE_USUARIO_ALUMNO);
      if (pos !== -1) {
        const libro = LIBROS.find((l) => l.isbn === isbn);
        if (libro) {
          lista.push({
            isbn: libro.isbn,
            titulo: libro.titulo,
            autor: libro.autor,
            posicion: pos + 1,
            fechaSolicitud: 'Hoy',
            esMio: true,
          });
        }
      }
    });
    return lista;
  }, [colasEspera]);

  // Vistos recientemente ordenados del tope hacia atrás (los 3 últimos)
  const recientes = useMemo<Libro[]>(() => {
    const arrayPila = pilaRecientes.aArray();
    return arrayPila.slice(-3).reverse();
  }, [pilaRecientes]);

  const value = useMemo<BibliotecaContextValor>(
    () => ({
      prestamos,
      reservasEnEspera,
      recientes,
      avisosEnApp,
      usuario,
      agregarReciente,
      reservarLibro,
      devolverLibro,
      alternarRecordatorio,
      entregarAlSiguiente,
      iniciarSesion,
      cerrarSesion,
      eliminarAviso,
      obtenerEjemplaresDisponibles,
      obtenerPersonasEnEspera,
      estaPrestadoOReservado,
      obtenerColaLibro,
    }),
    [
      prestamos,
      reservasEnEspera,
      recientes,
      avisosEnApp,
      usuario,
      agregarReciente,
      reservarLibro,
      devolverLibro,
      alternarRecordatorio,
      entregarAlSiguiente,
      iniciarSesion,
      cerrarSesion,
      eliminarAviso,
      obtenerEjemplaresDisponibles,
      obtenerPersonasEnEspera,
      estaPrestadoOReservado,
      obtenerColaLibro,
    ],
  );

  return (
    <BibliotecaContext.Provider value={value}>
      {children}
    </BibliotecaContext.Provider>
  );
}

export function useBiblioteca(): BibliotecaContextValor {
  const context = useContext(BibliotecaContext);
  if (!context) {
    throw new Error('useBiblioteca debe usarse dentro de un BibliotecaProvider');
  }
  return context;
}
