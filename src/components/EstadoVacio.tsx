import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TEMA } from '../constants/tema';

interface EstadoVacioProps {
  mensaje: string;
  descripcion?: string;
}

export function EstadoVacio({
  mensaje,
  descripcion,
}: EstadoVacioProps) {
  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>{mensaje}</Text>
      {descripcion && <Text style={estilos.descripcion}>{descripcion}</Text>}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    padding: TEMA.espaciados.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: TEMA.tipografia.lg,
    fontWeight: '600',
    color: TEMA.colores.textoSecundario,
    textAlign: 'center',
  },
  descripcion: {
    fontSize: TEMA.tipografia.sm,
    color: TEMA.colores.textoSecundario,
    textAlign: 'center',
    marginTop: TEMA.espaciados.sm,
  },
});
