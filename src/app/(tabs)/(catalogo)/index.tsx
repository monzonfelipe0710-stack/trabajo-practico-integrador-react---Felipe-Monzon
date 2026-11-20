import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  type ListRenderItem,
} from 'react-native';
import { router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLibros } from '../../../hooks/useLibros';
import { usePermiso } from '../../../hooks/usePermiso';
import { useBiblioteca } from '../../../context/BibliotecaContext';
import { TarjetaLibro } from '../../../components/TarjetaLibro';
import { SeccionRecientes } from '../../../components/SeccionRecientes';
import { EstadoCargando } from '../../../components/EstadoCargando';
import { EstadoError } from '../../../components/EstadoError';
import { EstadoVacio } from '../../../components/EstadoVacio';
import type { Libro } from '../../../types';
import { TEMA } from '../../../constants/tema';

export default function PantallaCatalogo() {
  const navigation = useNavigation();
  const { libros, cargando, error, reintentar } = useLibros();
  const {
    recientes,
    obtenerEjemplaresDisponibles,
    obtenerPersonasEnEspera,
    usuario,
  } = useBiblioteca();
  const { esConcedido } = usePermiso('camara');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Biblioteca IPF',
      headerRight: () => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            usuario ? 'Ir al mostrador de personal' : 'Ingresar como personal'
          }
          onPress={() => {
            if (usuario) {
              router.push('/mostrador');
            } else {
              router.push('/login');
            }
          }}
          style={({ pressed }) => [
            estilos.botonPersonal,
            pressed && estilos.botonPersonalPresionado,
          ]}
        >
          <Ionicons
            name={usuario ? 'shield-checkmark' : 'person-circle-outline'}
            size={22}
            color={TEMA.colores.primario}
          />
          <Text style={estilos.textoPersonal}>
            {usuario ? 'Mostrador' : 'Personal'}
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, usuario]);

  const navegarADetalle = (isbn: string) => {
    router.push(`/libro/${isbn}`);
  };

  const abrirEscanear = () => {
    if (esConcedido) {
      router.push('/escanear');
    } else {
      router.push('/permisos/camara');
    }
  };

  const renderItem: ListRenderItem<Libro> = ({ item }) => {
    const disponibles = obtenerEjemplaresDisponibles(item.isbn);
    const estaPrestado = disponibles === 0;
    const espera = obtenerPersonasEnEspera(item.isbn);
    return (
      <TarjetaLibro
        libro={item}
        ejemplaresDisponibles={disponibles}
        personasEnEspera={espera}
        onPress={() => navegarADetalle(item.isbn)}
        estadoPrestado={estaPrestado}
      />
    );
  };

  const CabeceraLista = (
    <View>
      <View style={estilos.barraAcciones}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Buscar libros por título o autor"
          onPress={() => router.push('/buscar')}
          style={({ pressed }) => [
            estilos.botonAccion,
            pressed && estilos.botonAccionPresionado,
          ]}
        >
          <Ionicons
            name="search-outline"
            size={20}
            color={TEMA.colores.primario}
          />
          <Text style={estilos.textoAccion}>Buscar</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Escanear código de barras de un libro"
          onPress={abrirEscanear}
          style={({ pressed }) => [
            estilos.botonAccion,
            pressed && estilos.botonAccionPresionado,
          ]}
        >
          <Ionicons
            name="barcode-outline"
            size={20}
            color={TEMA.colores.primario}
          />
          <Text style={estilos.textoAccion}>Escanear</Text>
        </Pressable>
      </View>

      <SeccionRecientes
        recientes={recientes}
        onSeleccionarLibro={navegarADetalle}
      />

      <View style={estilos.subtituloContenedor}>
        <Text style={estilos.subtitulo}>Todos los libros</Text>
        <Text style={estilos.contadorLibros}>
          {libros.length} {libros.length === 1 ? 'título' : 'títulos'}
        </Text>
      </View>
    </View>
  );

  if (cargando) {
    return <EstadoCargando mensaje="Cargando catálogo de la biblioteca..." />;
  }

  if (error) {
    return <EstadoError mensaje={error} onReintentar={reintentar} />;
  }

  return (
    <View style={estilos.pantalla}>
      <FlatList
        data={libros}
        keyExtractor={(item) => item.isbn}
        renderItem={renderItem}
        ListHeaderComponent={CabeceraLista}
        ListEmptyComponent={
          <EstadoVacio
            mensaje="No hay libros disponibles en el catálogo."
            descripcion="Intentá volver a cargar más tarde."
          />
        }
        contentContainerStyle={estilos.listaContenido}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: TEMA.colores.fondo,
  },
  listaContenido: {
    paddingBottom: TEMA.espaciados.xxl,
  },
  botonPersonal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: TEMA.espaciados.xs,
    paddingHorizontal: TEMA.espaciados.md,
    paddingVertical: TEMA.espaciados.xs,
    minHeight: TEMA.accesibilidad.areaMinima,
    justifyContent: 'center',
  },
  botonPersonalPresionado: {
    opacity: 0.7,
  },
  textoPersonal: {
    fontSize: TEMA.tipografia.sm,
    fontWeight: 'bold',
    color: TEMA.colores.primario,
  },
  barraAcciones: {
    flexDirection: 'row',
    paddingHorizontal: TEMA.espaciados.lg,
    paddingVertical: TEMA.espaciados.md,
    gap: TEMA.espaciados.md,
    backgroundColor: TEMA.colores.superficie,
  },
  botonAccion: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: TEMA.espaciados.sm,
    backgroundColor: TEMA.colores.fondo,
    borderRadius: TEMA.bordes.md,
    borderWidth: 1,
    borderColor: TEMA.colores.borde,
    minHeight: TEMA.accesibilidad.areaMinima,
    paddingHorizontal: TEMA.espaciados.md,
  },
  botonAccionPresionado: {
    backgroundColor: TEMA.colores.borde,
  },
  textoAccion: {
    fontSize: TEMA.tipografia.md,
    fontWeight: '600',
    color: TEMA.colores.texto,
  },
  subtituloContenedor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: TEMA.espaciados.lg,
    paddingTop: TEMA.espaciados.lg,
    paddingBottom: TEMA.espaciados.sm,
  },
  subtitulo: {
    fontSize: TEMA.tipografia.lg,
    fontWeight: 'bold',
    color: TEMA.colores.texto,
  },
  contadorLibros: {
    fontSize: TEMA.tipografia.sm,
    color: TEMA.colores.textoSecundario,
  },
});
