import { useEffect, useState, useCallback } from 'react';
import { obtenerLibros } from '../lib/api';
import type { Libro } from '../types';

export function useLibros() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState<number>(0);

  const reintentar = useCallback(() => {
    setIntento((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    setError(null);

    obtenerLibros()
      .then((datos) => {
        if (!cancelado) {
          setLibros(datos);
          setCargando(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelado) {
          const mensaje =
            err instanceof Error
              ? err.message
              : 'No se pudo conectar con la biblioteca.';
          setError(mensaje);
          setCargando(false);
        }
      });

    return () => {
      cancelado = true;
    };
  }, [intento]);

  return { libros, cargando, error, reintentar };
}
