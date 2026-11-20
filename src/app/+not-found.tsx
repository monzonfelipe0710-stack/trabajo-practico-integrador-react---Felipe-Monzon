import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link, router, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Boton } from '../components/Boton';
import { TEMA } from '../constants/tema';

export default function PantallaNoEncontrado() {
  const rutaInexistente = usePathname();

  return (
    <View style={estilos.contenedor}>
      <View style={estilos.tarjeta}>
        <Ionicons
          name="compass-outline"
          size={56}
          color={TEMA.colores.primario}
        />
        <Text style={estilos.codigo}>404</Text>
        <Text style={estilos.titulo}>Página no encontrada</Text>

        <Text style={estilos.mensaje}>
          La dirección a la que intentás acceder no existe en la aplicación de la
          Biblioteca IPF:
        </Text>

        <View style={estilos.cajaRuta}>
          <Text style={estilos.textoRuta}>
            {rutaInexistente || 'Ruta no válida'}
          </Text>
        </View>

        <View style={estilos.botonContenedor}>
          <Link href="/" asChild>
            <Boton
              titulo="Ir al Catálogo Principal"
              onPress={() => router.replace('/')}
            />
          </Link>
        </View>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: TEMA.colores.fondo,
    alignItems: 'center',
    justifyContent: 'center',
    padding: TEMA.espaciados.lg,
  },
  tarjeta: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: TEMA.colores.superficie,
    borderRadius: TEMA.bordes.xl,
    padding: TEMA.espaciados.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: TEMA.colores.borde,
  },
  codigo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: TEMA.colores.primario,
    marginTop: TEMA.espaciados.sm,
  },
  titulo: {
    fontSize: TEMA.tipografia.xl,
    fontWeight: 'bold',
    color: TEMA.colores.texto,
    marginBottom: TEMA.espaciados.sm,
  },
  mensaje: {
    fontSize: TEMA.tipografia.sm,
    color: TEMA.colores.textoSecundario,
    textAlign: 'center',
    marginBottom: TEMA.espaciados.md,
    lineHeight: 20,
  },
  cajaRuta: {
    backgroundColor: TEMA.colores.fondo,
    paddingHorizontal: TEMA.espaciados.md,
    paddingVertical: TEMA.espaciados.sm,
    borderRadius: TEMA.bordes.md,
    borderWidth: 1,
    borderColor: TEMA.colores.borde,
    marginBottom: TEMA.espaciados.xl,
    width: '100%',
    alignItems: 'center',
  },
  textoRuta: {
    fontFamily: 'monospace',
    fontSize: TEMA.tipografia.sm,
    color: TEMA.colores.error,
    fontWeight: '600',
  },
  botonContenedor: {
    width: '100%',
  },
});
