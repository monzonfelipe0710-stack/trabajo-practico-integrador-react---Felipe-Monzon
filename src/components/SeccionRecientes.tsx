import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import type { Libro } from '../types';
import { TEMA } from '../constants/tema';

interface SeccionRecientesProps {
  recientes: Libro[];
  onSeleccionarLibro: (isbn: string) => void;
}

export function SeccionRecientes({
  recientes,
  onSeleccionarLibro,
}: SeccionRecientesProps) {
  if (recientes.length === 0) {
    return null;
  }

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Vistos recientemente</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={estilos.listaContenedor}
      >
        {recientes.map((libro) => (
          <Pressable
            key={libro.isbn}
            accessibilityRole="button"
            accessibilityLabel={`Abrir libro visto recientemente ${libro.titulo}`}
            onPress={() => onSeleccionarLibro(libro.isbn)}
            style={({ pressed }) => [
              estilos.chip,
              pressed && estilos.chipPresionado,
            ]}
          >
            <Text style={estilos.chipTitulo} numberOfLines={1}>
              {libro.titulo}
            </Text>
            <Text style={estilos.chipAutor} numberOfLines={1}>
              {libro.autor}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    paddingVertical: TEMA.espaciados.sm,
    backgroundColor: TEMA.colores.fondo,
    borderBottomWidth: 1,
    borderBottomColor: TEMA.colores.borde,
  },
  titulo: {
    fontSize: TEMA.tipografia.sm,
    fontWeight: 'bold',
    color: TEMA.colores.textoSecundario,
    paddingHorizontal: TEMA.espaciados.lg,
    marginBottom: TEMA.espaciados.xs,
    textTransform: 'uppercase',
  },
  listaContenedor: {
    paddingHorizontal: TEMA.espaciados.lg,
    gap: TEMA.espaciados.sm,
  },
  chip: {
    backgroundColor: TEMA.colores.superficie,
    borderRadius: TEMA.bordes.md,
    paddingVertical: TEMA.espaciados.sm,
    paddingHorizontal: TEMA.espaciados.md,
    borderWidth: 1,
    borderColor: TEMA.colores.borde,
    maxWidth: 160,
    minHeight: TEMA.accesibilidad.areaMinima,
    justifyContent: 'center',
  },
  chipPresionado: {
    backgroundColor: TEMA.colores.borde,
  },
  chipTitulo: {
    fontSize: TEMA.tipografia.sm,
    fontWeight: '600',
    color: TEMA.colores.texto,
  },
  chipAutor: {
    fontSize: TEMA.tipografia.xs,
    color: TEMA.colores.textoSecundario,
  },
});
