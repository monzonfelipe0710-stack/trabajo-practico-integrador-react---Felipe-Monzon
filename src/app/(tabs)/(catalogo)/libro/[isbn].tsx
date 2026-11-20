import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useNavigation, router, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LIBROS } from '../../../../data/libros';
import { useBiblioteca } from '../../../../context/BibliotecaContext';
import { Boton } from '../../../../components/Boton';
import { TEMA } from '../../../../constants/tema';

export default function PantallaDetalleLibro() {
  const { isbn } = useLocalSearchParams<{ isbn: string }>();
  const navigation = useNavigation();
  const {
    agregarReciente,
    obtenerEjemplaresDisponibles,
    obtenerPersonasEnEspera,
    estaPrestadoOReservado,
  } = useBiblioteca();

  // Validación de parámetro ISBN: exactamente 13 dígitos numéricos
  const esIsbnValido = useMemo(() => {
    if (!isbn || typeof isbn !== 'string') return false;
    return /^\d{13}$/.test(isbn);
  }, [isbn]);

  const libro = useMemo(() => {
    if (!esIsbnValido || !isbn) return undefined;
    return LIBROS.find((l) => l.isbn === isbn);
  }, [esIsbnValido, isbn]);

  // Si existe, apilar en vistos recientemente (Pila LIFO)
  useEffect(() => {
    if (libro) {
      agregarReciente(libro);
    }
  }, [libro, agregarReciente]);

  // Actualizar el título del header con el título del libro
  useLayoutEffect(() => {
    if (libro) {
      navigation.setOptions({
        headerTitle: libro.titulo,
      });
    } else {
      navigation.setOptions({
        headerTitle: 'Libro no encontrado',
      });
    }
  }, [navigation, libro]);

  if (!esIsbnValido || !libro) {
    return (
      <View style={estilos.contenedorError}>
        <View style={estilos.tarjetaError}>
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={TEMA.colores.error}
          />
          <Text style={estilos.tituloError}>Libro no encontrado</Text>
          <Text style={estilos.mensajeError}>
            {!esIsbnValido
              ? `El código ISBN ingresado ("${isbn || ''}") no es válido. Debe contener exactamente 13 dígitos numéricos.`
              : `No encontramos ningún ejemplar con el código ISBN ${isbn} en el catálogo del Instituto.`}
          </Text>
          <Link href="/" asChild>
            <Boton
              titulo="Volver al Catálogo"
              onPress={() => router.navigate('/')}
            />
          </Link>
        </View>
      </View>
    );
  }

  const disponibles = obtenerEjemplaresDisponibles(libro.isbn);
  const personasEnEspera = obtenerPersonasEnEspera(libro.isbn);
  const yaSolicitado = estaPrestadoOReservado(libro.isbn);

  return (
    <ScrollView style={estilos.pantalla} contentContainerStyle={estilos.contenido}>
      <View style={estilos.tarjetaPrincipal}>
        <View style={estilos.iconoContenedor}>
          <Ionicons name="book" size={64} color={TEMA.colores.primario} />
        </View>

        <Text style={estilos.titulo}>{libro.titulo}</Text>
        <Text style={estilos.autor}>{libro.autor}</Text>
        <Text style={estilos.anioPublicacion}>Publicado en el año {libro.anio}</Text>
        <Text style={estilos.isbnEtiqueta}>ISBN: {libro.isbn}</Text>

        <View style={estilos.separador} />

        <View style={estilos.filaEstado}>
          <View style={estilos.columnaEstado}>
            <Text style={estilos.etiquetaEstado}>Ejemplares disponibles</Text>
            <Text
              style={[
                estilos.valorEstado,
                disponibles > 0 ? estilos.valorDisponible : estilos.valorSinStock,
              ]}
            >
              {disponibles}
            </Text>
          </View>

          <View style={estilos.columnaEstado}>
            <Text style={estilos.etiquetaEstado}>Personas en espera</Text>
            <Text
              style={[
                estilos.valorEstado,
                personasEnEspera > 0 ? estilos.valorAlerta : estilos.valorNeutro,
              ]}
            >
              {personasEnEspera}
            </Text>
          </View>
        </View>

        <View style={estilos.seccionBoton}>
          {yaSolicitado ? (
            <View style={estilos.cajaYaSolicitado}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={TEMA.colores.exito}
              />
              <Text style={estilos.textoYaSolicitado}>
                Ya contás con este libro en préstamo o en tu lista de espera.
              </Text>
            </View>
          ) : (
            <Boton
              titulo={
                disponibles > 0
                  ? 'Reservar (Préstamo por 7 días)'
                  : 'Anotarme en lista de espera'
              }
              variante={disponibles > 0 ? 'primario' : 'secundario'}
              onPress={() => router.push(`/reservar/${libro.isbn}`)}
            />
          )}
        </View>
      </View>
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
  },
  contenedorError: {
    flex: 1,
    padding: TEMA.espaciados.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TEMA.colores.fondo,
  },
  tarjetaError: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: TEMA.colores.superficie,
    borderRadius: TEMA.bordes.lg,
    padding: TEMA.espaciados.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: TEMA.colores.borde,
  },
  tituloError: {
    fontSize: TEMA.tipografia.xl,
    fontWeight: 'bold',
    color: TEMA.colores.error,
    marginTop: TEMA.espaciados.md,
    marginBottom: TEMA.espaciados.sm,
  },
  mensajeError: {
    fontSize: TEMA.tipografia.md,
    color: TEMA.colores.textoSecundario,
    textAlign: 'center',
    marginBottom: TEMA.espaciados.xl,
    lineHeight: 22,
  },
  tarjetaPrincipal: {
    backgroundColor: TEMA.colores.superficie,
    borderRadius: TEMA.bordes.xl,
    padding: TEMA.espaciados.xl,
    borderWidth: 1,
    borderColor: TEMA.colores.borde,
    alignItems: 'center',
  },
  iconoContenedor: {
    width: 100,
    height: 100,
    borderRadius: TEMA.bordes.full,
    backgroundColor: TEMA.colores.primarioClaro,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: TEMA.espaciados.lg,
  },
  titulo: {
    fontSize: TEMA.tipografia.xxl,
    fontWeight: 'bold',
    color: TEMA.colores.texto,
    textAlign: 'center',
    marginBottom: TEMA.espaciados.xs,
  },
  autor: {
    fontSize: TEMA.tipografia.lg,
    color: TEMA.colores.primario,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: TEMA.espaciados.xs,
  },
  anioPublicacion: {
    fontSize: TEMA.tipografia.sm,
    color: TEMA.colores.textoSecundario,
    marginBottom: TEMA.espaciados.xs,
  },
  isbnEtiqueta: {
    fontSize: TEMA.tipografia.xs,
    color: TEMA.colores.textoSecundario,
    marginBottom: TEMA.espaciados.lg,
  },
  separador: {
    width: '100%',
    height: 1,
    backgroundColor: TEMA.colores.borde,
    marginVertical: TEMA.espaciados.lg,
  },
  filaEstado: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: TEMA.espaciados.xl,
  },
  columnaEstado: {
    alignItems: 'center',
  },
  etiquetaEstado: {
    fontSize: TEMA.tipografia.xs,
    color: TEMA.colores.textoSecundario,
    marginBottom: TEMA.espaciados.xs,
  },
  valorEstado: {
    fontSize: TEMA.tipografia.xxl,
    fontWeight: 'bold',
  },
  valorDisponible: {
    color: TEMA.colores.exito,
  },
  valorSinStock: {
    color: TEMA.colores.error,
  },
  valorAlerta: {
    color: TEMA.colores.advertencia,
  },
  valorNeutro: {
    color: TEMA.colores.textoSecundario,
  },
  seccionBoton: {
    width: '100%',
  },
  cajaYaSolicitado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: TEMA.espaciados.sm,
    backgroundColor: TEMA.colores.exitoFondo,
    padding: TEMA.espaciados.md,
    borderRadius: TEMA.bordes.md,
    borderWidth: 1,
    borderColor: TEMA.colores.exito,
  },
  textoYaSolicitado: {
    fontSize: TEMA.tipografia.sm,
    color: TEMA.colores.exito,
    fontWeight: '600',
    flex: 1,
  },
});
