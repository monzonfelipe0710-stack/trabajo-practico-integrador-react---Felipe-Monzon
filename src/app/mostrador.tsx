import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LIBROS } from '../data/libros';
import { useBiblioteca } from '../context/BibliotecaContext';
import { Boton } from '../components/Boton';
import { EstadoVacio } from '../components/EstadoVacio';
import { TEMA } from '../constants/tema';

export default function PantallaMostrador() {
  const {
    usuario,
    cerrarSesion,
    obtenerColaLibro,
    entregarAlSiguiente,
    obtenerEjemplaresDisponibles,
  } = useBiblioteca();

  // Filtrar los libros que tienen lista de espera activa
  const librosConEspera = LIBROS.map((libro) => {
    const cola = obtenerColaLibro(libro.isbn);
    return {
      libro,
      cola,
      quienEstaAlFrente: cola.length > 0 ? cola[0] : null,
      cuantosEsperan: cola.length,
    };
  }).filter((item) => item.cuantosEsperan > 0);

  const manejarEntrega = async (isbn: string, titulo: string, frente: string | null) => {
    if (!frente) {
      Alert.alert(
        'Lista vacía',
        'No hay personas en la lista de espera de este libro.',
      );
      return;
    }

    await entregarAlSiguiente(isbn);
    Alert.alert(
      'Ejemplar entregado',
      `Se entregó un ejemplar de "${titulo}" a ${frente}.`,
    );
  };

  const manejarCerrarSesion = () => {
    cerrarSesion();
    // Al cerrar la sesión, el mostrador desaparece del historial (A3 #8)
    router.replace('/');
  };

  return (
    <ScrollView style={estilos.pantalla} contentContainerStyle={estilos.contenido}>
      {/* Cabecera de personal */}
      <View style={estilos.cabecera}>
        <View style={estilos.infoUsuario}>
          <Ionicons
            name="shield-checkmark"
            size={24}
            color={TEMA.colores.primario}
          />
          <View>
            <Text style={estilos.nombreUsuario}>
              {usuario?.nombre || 'Personal de Biblioteca'}
            </Text>
            <Text style={estilos.rolUsuario}>Sesión activa de administración</Text>
          </View>
        </View>

        <Boton
          titulo="Cerrar sesión"
          variante="peligro"
          onPress={manejarCerrarSesion}
        />
      </View>

      <Text style={estilos.tituloSeccion}>
        Libros con lista de espera ({librosConEspera.length})
      </Text>

      {librosConEspera.length === 0 ? (
        <EstadoVacio
          mensaje="No hay libros con personas en lista de espera"
          descripcion="Todas las solicitudes fueron atendidas o los libros cuentan con ejemplares suficientes."
        />
      ) : (
        librosConEspera.map(({ libro, cola, quienEstaAlFrente, cuantosEsperan }) => {
          const disponibles = obtenerEjemplaresDisponibles(libro.isbn);
          return (
            <View key={libro.isbn} style={estilos.tarjetaLibro}>
              <View style={estilos.cabeceraTarjeta}>
                <View style={estilos.infoLibro}>
                  <Text style={estilos.tituloLibro}>{libro.titulo}</Text>
                  <Text style={estilos.autorLibro}>{libro.autor}</Text>
                  <Text style={estilos.isbnLibro}>ISBN: {libro.isbn}</Text>
                </View>

                <View style={estilos.badgeCantidad}>
                  <Text style={estilos.textoBadgeCantidad}>
                    {cuantosEsperan} {cuantosEsperan === 1 ? 'en espera' : 'en espera'}
                  </Text>
                </View>
                <View style={estilos.infoAdicional}>
                  <Text style={estilos.textoInfoAdicional}>
                    {disponibles} {disponibles === 1 ? 'ejemplar disponible' : 'ejemplares disponibles'}
                  </Text>
                </View>
              </View>

              <View style={estilos.cajaFrente}>
                <Text style={estilos.etiquetaFrente}>
                  Siguiente persona al frente de la cola:
                </Text>
                <Text style={estilos.nombreFrente}>
                  👤 {quienEstaAlFrente || 'Sin solicitantes'}
                </Text>
                {cola.length > 1 && (
                  <Text style={estilos.restoCola}>
                    Detrás esperan: {cola.slice(1).join(', ')}
                  </Text>
                )}
              </View>

              <View style={estilos.accionesTarjeta}>
                <Boton
                  titulo="Entregar al siguiente"
                  variante="primario"
                  onPress={() =>
                    manejarEntrega(libro.isbn, libro.titulo, quienEstaAlFrente)
                  }
                  deshabilitado={!quienEstaAlFrente}
                />
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: TEMA.colores.fondo,
  },
  contenido: {
    padding: TEMA.espaciados.lg,
    paddingBottom: TEMA.espaciados.xxxl,
  },
  cabecera: {
    backgroundColor: TEMA.colores.superficie,
    borderRadius: TEMA.bordes.lg,
    padding: TEMA.espaciados.lg,
    borderWidth: 1,
    borderColor: TEMA.colores.borde,
    marginBottom: TEMA.espaciados.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: TEMA.espaciados.md,
  },
  nombreUsuario: {
    fontSize: TEMA.tipografia.md,
    fontWeight: 'bold',
    color: TEMA.colores.texto,
  },
  rolUsuario: {
    fontSize: TEMA.tipografia.xs,
    color: TEMA.colores.textoSecundario,
  },
  tituloSeccion: {
    fontSize: TEMA.tipografia.lg,
    fontWeight: 'bold',
    color: TEMA.colores.texto,
    marginBottom: TEMA.espaciados.md,
  },
  tarjetaLibro: {
    backgroundColor: TEMA.colores.superficie,
    borderRadius: TEMA.bordes.lg,
    padding: TEMA.espaciados.lg,
    borderWidth: 1,
    borderColor: TEMA.colores.borde,
    marginBottom: TEMA.espaciados.lg,
  },
  cabeceraTarjeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: TEMA.espaciados.md,
  },
  infoLibro: {
    flex: 1,
    paddingRight: TEMA.espaciados.sm,
  },
  tituloLibro: {
    fontSize: TEMA.tipografia.md,
    fontWeight: 'bold',
    color: TEMA.colores.texto,
  },
  autorLibro: {
    fontSize: TEMA.tipografia.sm,
    color: TEMA.colores.textoSecundario,
  },
  isbnLibro: {
    fontSize: TEMA.tipografia.xs,
    color: TEMA.colores.textoSecundario,
    marginTop: 2,
  },
  badgeCantidad: {
    backgroundColor: TEMA.colores.advertenciaFondo,
    borderRadius: TEMA.bordes.sm,
    paddingHorizontal: TEMA.espaciados.sm,
    paddingVertical: TEMA.espaciados.xs,
  },
  textoBadgeCantidad: {
    fontSize: TEMA.tipografia.xs,
    fontWeight: 'bold',
    color: TEMA.colores.advertencia,
  },
  infoAdicional: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: TEMA.espaciados.xs,
  },
  textoInfoAdicional: {
    fontSize: TEMA.tipografia.xs,
    color: TEMA.colores.textoSecundario,
    marginLeft: TEMA.espaciados.xs,
  },
  cajaFrente: {
    backgroundColor: TEMA.colores.fondo,
    borderRadius: TEMA.bordes.md,
    padding: TEMA.espaciados.md,
    borderWidth: 1,
    borderColor: TEMA.colores.borde,
    marginBottom: TEMA.espaciados.md,
  },
  etiquetaFrente: {
    fontSize: TEMA.tipografia.xs,
    color: TEMA.colores.textoSecundario,
    marginBottom: 2,
  },
  nombreFrente: {
    fontSize: TEMA.tipografia.md,
    fontWeight: 'bold',
    color: TEMA.colores.primario,
    marginBottom: 4,
  },
  restoCola: {
    fontSize: TEMA.tipografia.xs,
    color: TEMA.colores.textoSecundario,
    marginTop: 2,
  },
  accionesTarjeta: {
    paddingTop: TEMA.espaciados.sm,
  },
});