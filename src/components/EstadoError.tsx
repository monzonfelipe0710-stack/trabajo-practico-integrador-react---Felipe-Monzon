import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Boton } from './Boton';
import { TEMA } from '../constants/tema';

interface EstadoErrorProps {
  mensaje: string;
  onReintentar?: () => void;
}

export function EstadoError({ mensaje, onReintentar }: EstadoErrorProps) {
  return (
    <View style={estilos.contenedor}>
      <View style={estilos.tarjeta}>
        <Text style={estilos.titulo}>Ocurrió un problema</Text>
        <Text style={estilos.mensaje}>{mensaje}</Text>
        {onReintentar && (
          <View style={estilos.botonContenedor}>
            <Boton titulo="Reintentar" onPress={onReintentar} />
          </View>
        )}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: TEMA.espaciados.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tarjeta: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: TEMA.colores.errorFondo,
    borderRadius: TEMA.bordes.lg,
    padding: TEMA.espaciados.xl,
    borderWidth: 1,
    borderColor: TEMA.colores.error,
    alignItems: 'center',
  },
  titulo: {
    fontSize: TEMA.tipografia.lg,
    fontWeight: 'bold',
    color: TEMA.colores.error,
    marginBottom: TEMA.espaciados.sm,
  },
  mensaje: {
    fontSize: TEMA.tipografia.md,
    color: TEMA.colores.texto,
    textAlign: 'center',
    marginBottom: TEMA.espaciados.lg,
  },
  botonContenedor: {
    width: '100%',
  },
});
