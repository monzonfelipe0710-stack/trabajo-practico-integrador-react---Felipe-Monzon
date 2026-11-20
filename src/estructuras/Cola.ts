export class Cola<T> {
  #items: T[];

  constructor(itemsIniciales: T[] = []) {
    this.#items = [...itemsIniciales];
  }

  encolar(item: T): void {
    this.#items.push(item);
  }

  desencolar(): T | undefined {
    if (this.#items.length === 0) {
      return undefined;
    }
    const primerElemento = this.#items[0];
    const nuevosItems: T[] = [];
    for (let i = 1; i < this.#items.length; i++) {
      nuevosItems.push(this.#items[i]);
    }
    this.#items = nuevosItems;
    return primerElemento;
  }

  frente(): T | undefined {
    if (this.#items.length === 0) {
      return undefined;
    }
    return this.#items[0];
  }

  estaVacia(): boolean {
    return this.#items.length === 0;
  }

  get tamanio(): number {
    return this.#items.length;
  }

  aArray(): T[] {
    return [...this.#items];
  }
}
