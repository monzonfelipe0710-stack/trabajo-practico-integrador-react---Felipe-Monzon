import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { TEMA } from '../constants/tema';

interface EstadoCargandoProps {
  mensaje?: string;
}

export function EstadoCargando({
  mensaje = 'Cargando catálogo...',
}: EstadoCargandoProps) {
  return (
    <View style={estilos.contenedor}>
      <ActivityIndicator size="large" color={TEMA.colores.primario} />
      <Text style={estilos.texto}>{mensaje}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: TEMA.espaciados.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    marginTop: TEMA.espaciados.md,
    fontSize: TEMA.tipografia.md,
    color: TEMA.colores.textoSecundario,
  },
});
