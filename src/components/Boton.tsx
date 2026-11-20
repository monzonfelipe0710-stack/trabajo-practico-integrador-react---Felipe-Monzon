import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  type GestureResponderEvent,
} from 'react-native';
import { TEMA } from '../constants/tema';

interface BotonProps {
  titulo: string;
  onPress: (event: GestureResponderEvent) => void;
  variante?: 'primario' | 'secundario' | 'peligro' | 'borde';
  deshabilitado?: boolean;
  accessibilityLabel?: string;
}

export function Boton({
  titulo,
  onPress,
  variante = 'primario',
  deshabilitado = false,
  accessibilityLabel,
}: BotonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || titulo}
      accessibilityState={{ disabled: deshabilitado }}
      disabled={deshabilitado}
      onPress={onPress}
      style={({ pressed }) => [
        estilos.boton,
        variante === 'primario' && estilos.botonPrimario,
        variante === 'secundario' && estilos.botonSecundario,
        variante === 'peligro' && estilos.botonPeligro,
        variante === 'borde' && estilos.botonBorde,
        deshabilitado && estilos.botonDeshabilitado,
        pressed && !deshabilitado && estilos.botonPresionado,
      ]}
    >
      <Text
        style={[
          estilos.texto,
          variante === 'borde' ? estilos.textoBorde : estilos.textoBlanco,
          deshabilitado && estilos.textoDeshabilitado,
        ]}
      >
        {titulo}
      </Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  boton: {
    minHeight: TEMA.accesibilidad.areaMinima,
    minWidth: TEMA.accesibilidad.areaMinima,
    paddingVertical: TEMA.espaciados.md,
    paddingHorizontal: TEMA.espaciados.lg,
    borderRadius: TEMA.bordes.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonPrimario: {
    backgroundColor: TEMA.colores.primario,
  },
  botonSecundario: {
    backgroundColor: TEMA.colores.secundario,
  },
  botonPeligro: {
    backgroundColor: TEMA.colores.error,
  },
  botonBorde: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: TEMA.colores.primario,
  },
  botonDeshabilitado: {
    backgroundColor: TEMA.colores.deshabilitado,
    borderColor: TEMA.colores.deshabilitado,
  },
  botonPresionado: {
    opacity: 0.85,
  },
  texto: {
    fontSize: TEMA.tipografia.md,
    fontWeight: '600',
  },
  textoBlanco: {
    color: '#FFFFFF',
  },
  textoBorde: {
    color: TEMA.colores.primario,
  },
  textoDeshabilitado: {
    color: '#FFFFFF',
  },
});
