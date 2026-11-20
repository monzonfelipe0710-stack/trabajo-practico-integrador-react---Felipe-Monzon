import { Pila } from '../src/estructuras/Pila';
import { Cola } from '../src/estructuras/Cola';

describe('Estructuras de datos', () => {
  describe('Pila', () => {
    test('apila y desapila respetando el orden LIFO', () => {
      const pila = new Pila<string>();
      pila.push('Libro 1');
      pila.push('Libro 2');
      expect(pila.tamanio).toBe(2);
      expect(pila.tope()).toBe('Libro 2');
      expect(pila.pop()).toBe('Libro 2');
      expect(pila.tamanio).toBe(1);
      expect(pila.tope()).toBe('Libro 1');
    });

    test('desapilar en una pila vacia retorna undefined', () => {
      const pila = new Pila<string>();
      expect(pila.estaVacia()).toBe(true);
      expect(pila.pop()).toBeUndefined();
      expect(pila.tope()).toBeUndefined();
    });

    test('aArray retorna una copia sin mutar la pila interna', () => {
      const pila = new Pila<number>([1, 2, 3]);
      const arr = pila.aArray();
      arr.push(4);
      expect(pila.tamanio).toBe(3);
      expect(pila.tope()).toBe(3);
    });
  });

  describe('Cola', () => {
    test('encola y desencola respetando el orden FIFO sin usar shift', () => {
      const cola = new Cola<string>();
      cola.encolar('Persona A');
      cola.encolar('Persona B');
      expect(cola.tamanio).toBe(2);
      expect(cola.frente()).toBe('Persona A');
      expect(cola.desencolar()).toBe('Persona A');
      expect(cola.tamanio).toBe(1);
      expect(cola.frente()).toBe('Persona B');
    });

    test('desencolar una cola vacia devuelve undefined', () => {
      const cola = new Cola<string>();
      expect(cola.estaVacia()).toBe(true);
      expect(cola.desencolar()).toBeUndefined();
      expect(cola.frente()).toBeUndefined();
    });

    test('aArray y constructor con valores iniciales funcionan correctamente', () => {
      const cola = new Cola<string>(['Ana', 'Bruno']);
      expect(cola.tamanio).toBe(2);
      expect(cola.aArray()).toEqual(['Ana', 'Bruno']);
      cola.desencolar();
      expect(cola.aArray()).toEqual(['Bruno']);
    });
  });
});
