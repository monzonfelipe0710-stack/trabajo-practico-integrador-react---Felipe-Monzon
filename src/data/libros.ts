import type { Libro } from '../types';

export const LIBROS: Libro[] = [
  {
    isbn: '9789500700146',
    titulo: 'Ficciones',
    autor: 'Jorge Luis Borges',
    anio: 1944,
    ejemplares: 2,
  },
  {
    isbn: '9789875666474',
    titulo: 'Cien años de soledad',
    autor: 'Gabriel García Márquez',
    anio: 1967,
    ejemplares: 3,
  },
  {
    isbn: '9788437604947',
    titulo: 'Don Quijote de la Mancha',
    autor: 'Miguel de Cervantes',
    anio: 1605,
    ejemplares: 1,
  },
  {
    isbn: '9789871138012',
    titulo: 'El Aleph',
    autor: 'Jorge Luis Borges',
    anio: 1949,
    ejemplares: 2,
  },
  {
    isbn: '9789505113255',
    titulo: 'Rayuela',
    autor: 'Julio Cortázar',
    anio: 1963,
    ejemplares: 0,
  },
  {
    isbn: '9788420682747',
    titulo: 'La metamorfosis',
    autor: 'Franz Kafka',
    anio: 1915,
    ejemplares: 4,
  },
  {
    isbn: '9788439722304',
    titulo: '1984',
    autor: 'George Orwell',
    anio: 1949,
    ejemplares: 0,
  },
  {
    isbn: '9788497592208',
    titulo: 'El túnel',
    autor: 'Ernesto Sabato',
    anio: 1948,
    ejemplares: 2,
  },
  {
    isbn: '9789870407133',
    titulo: 'Sobre héroes y tumbas',
    autor: 'Ernesto Sabato',
    anio: 1961,
    ejemplares: 1,
  },
  {
    isbn: '9788466332828',
    titulo: 'Crónica de una muerte anunciada',
    autor: 'Gabriel García Márquez',
    anio: 1981,
    ejemplares: 2,
  },
  {
    isbn: '9788420658766',
    titulo: 'El principito',
    autor: 'Antoine de Saint-Exupéry',
    anio: 1943,
    ejemplares: 5,
  },
  {
    isbn: '9788437601441',
    titulo: 'Bodas de sangre',
    autor: 'Federico García Lorca',
    anio: 1933,
    ejemplares: 1,
  },
  {
    isbn: '9788420674209',
    titulo: 'El extranjero',
    autor: 'Albert Camus',
    anio: 1942,
    ejemplares: 3,
  },
  {
    isbn: '9788497593793',
    titulo: 'Fahrenheit 451',
    autor: 'Ray Bradbury',
    anio: 1953,
    ejemplares: 0,
  },
  {
    isbn: '9788437600895',
    titulo: 'La casa de Bernarda Alba',
    autor: 'Federico García Lorca',
    anio: 1936,
    ejemplares: 2,
  },
  {
    isbn: '9789500419574',
    titulo: 'El señor de los anillos',
    autor: 'J.R.R. Tolkien',
    anio: 1954,
    ejemplares: 2,
  },
];

// Al menos dos libros con lista de espera inicial con una o dos personas
export const LISTAS_ESPERA_INICIALES: Record<string, string[]> = {
  '9789505113255': ['Ana Gómez', 'Carlos Benítez'],
  '9788439722304': ['María Fernández'],
};
