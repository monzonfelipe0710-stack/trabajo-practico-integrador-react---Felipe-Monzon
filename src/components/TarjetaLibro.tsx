import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import type { Libro } from '../types';
import { TEMA } from '../constants/tema';

interface TarjetaLibroProps {
  libro: Libro;
  ejemplaresDisponibles: number;
  personasEnEspera: number;
  onPress: () => void;
}

export function TarjetaLibro({
  libro,
  ejemplaresDisponibles,
  personasEnEspera,
  onPress,
}: TarjetaLibroProps) {
  const tieneStock = ejemplaresDisponibles > 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Libro ${libro.titulo}, autor ${libro.autor}. ${tieneStock ? `${ejemplaresDisponibles} ejemplares disponibles` : `Sin stock, ${personasEnEspera} en espera`}`}
      onPress={onPress}
      style={({ pressed }) => [
        estilos.tarjeta,
        pressed && estilos.tarjetaPresionada,
      ]}
    >
      <View style={estilos.info}>
        <Text style={estilos.titulo} numberOfLines={2}>
          {libro.titulo}
        </Text>
        <Text style={estilos.autor}>
          {libro.autor} · {libro.anio}
        </Text>
        <Text style={estilos.isbn}>ISBN: {libro.isbn}</Text>
      </View>

      <View style={estilos.estadoContenedor}>
        {tieneStock ? (
          <View style={estilos.badgeDisponible}>
            <Text style={estilos.textoBadgeDisponible}>
              {ejemplaresDisponibles}{' '}
              {ejemplaresDisponibles === 1 ? 'disponible' : 'disponibles'}
            </Text>
          </View>
        ) : (
          <View style={estilos.badgeEspera}>
            <Text style={estilos.textoBadgeEspera}>
              {personasEnEspera}{' '}
              {personasEnEspera === 1 ? 'en espera' : 'en espera'}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    backgroundColor: TEMA.colores.superficie,
    borderRadius: TEMA.bordes.lg,
    padding: TEMA.espaciados.lg,
    marginHorizontal: TEMA.espaciados.lg,
    marginVertical: TEMA.espaciados.xs,
    borderWidth: 1,
    borderColor: TEMA.colores.borde,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: TEMA.accesibilidad.areaMinima,
  },
  tarjetaPresionada: {
    backgroundColor: TEMA.colores.fondo,
  },
  info: {
    flex: 1,
    paddingRight: TEMA.espaciados.md,
  },
  titulo: {
    fontSize: TEMA.tipografia.md,
    fontWeight: 'bold',
    color: TEMA.colores.texto,
    marginBottom: TEMA.espaciados.xs,
  },
  autor: {
    fontSize: TEMA.tipografia.sm,
    color: TEMA.colores.textoSecundario,
    marginBottom: TEMA.espaciados.xs,
  },
  isbn: {
    fontSize: TEMA.tipografia.xs,
    color: TEMA.colores.textoSecundario,
  },
  estadoContenedor: {
    alignItems: 'flex-end',
  },
  badgeDisponible: {
    backgroundColor: TEMA.colores.exitoFondo,
    paddingHorizontal: TEMA.espaciados.sm,
    paddingVertical: TEMA.espaciados.xs,
    borderRadius: TEMA.bordes.sm,
  },
  textoBadgeDisponible: {
    fontSize: TEMA.tipografia.xs,
    fontWeight: '600',
    color: TEMA.colores.exito,
  },
  badgeEspera: {
    backgroundColor: TEMA.colores.advertenciaFondo,
    paddingHorizontal: TEMA.espaciados.sm,
    paddingVertical: TEMA.espaciados.xs,
    borderRadius: TEMA.bordes.sm,
  },
  textoBadgeEspera: {
    fontSize: TEMA.tipografia.xs,
    fontWeight: '600',
    color: TEMA.colores.advertencia,
  },
});
