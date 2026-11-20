import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  type ListRenderItem,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { buscarLibros } from '../lib/api';
import { useBiblioteca } from '../context/BibliotecaContext';
import { TarjetaLibro } from '../components/TarjetaLibro';
import { EstadoCargando } from '../components/EstadoCargando';
import { EstadoVacio } from '../components/EstadoVacio';
import type { Libro } from '../types';
import { TEMA } from '../constants/tema';

export default function PantallaBuscar() {
  const params = useLocalSearchParams<{ q?: string }>();
  const consultaUrl = typeof params.q === 'string' ? params.q : '';

  const [textoInput, setTextoInput] = useState(consultaUrl);
  const [resultados, setResultados] = useState<Libro[]>([]);
  const [cargando, setCargando] = useState(false);

  const { obtenerEjemplaresDisponibles, obtenerPersonasEnEspera } =
    useBiblioteca();

  // Sincronizar input local si cambia el parámetro de la URL
  useEffect(() => {
    setTextoInput(consultaUrl);
  }, [consultaUrl]);

  // Actualizar parámetro en la URL sin apilar pantallas
  const manejarCambioTexto = (texto: string) => {
    setTextoInput(texto);
    router.setParams({ q: texto });
  };

  // Búsqueda con debounce de 300 ms y protección contra condiciones de carrera
  useEffect(() => {
    let ignorarRespuesta = false;
    const termino = consultaUrl.trim();

    if (!termino) {
      setResultados([]);
      setCargando(false);
      return () => {
        ignorarRespuesta = true;
      };
    }

    setCargando(true);

    const temporizador = setTimeout(() => {
      buscarLibros(termino)
        .then((datos) => {
          if (!ignorarRespuesta) {
            setResultados(datos);
            setCargando(false);
          }
        })
        .catch(() => {
          if (!ignorarRespuesta) {
            setCargando(false);
          }
        });
    }, 300);

    return () => {
      ignorarRespuesta = true;
      clearTimeout(temporizador);
    };
  }, [consultaUrl]);

  const renderItem: ListRenderItem<Libro> = ({ item }) => {
    const disponibles = obtenerEjemplaresDisponibles(item.isbn);
    const espera = obtenerPersonasEnEspera(item.isbn);
    return (
      <TarjetaLibro
        libro={item}
        ejemplaresDisponibles={disponibles}
        personasEnEspera={espera}
        onPress={() => router.push(`/libro/${item.isbn}`)}
      />
    );
  };

  return (
    <View style={estilos.pantalla}>
      <View style={estilos.contenedorInput}>
        <Ionicons
          name="search-outline"
          size={20}
          color={TEMA.colores.textoSecundario}
        />
        <TextInput
          style={estilos.input}
          placeholder="Buscar por título o autor..."
          placeholderTextColor={TEMA.colores.textoSecundario}
          value={textoInput}
          onChangeText={manejarCambioTexto}
          autoFocus
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Campo de búsqueda de libros"
        />
        {textoInput.length > 0 && (
          <Ionicons
            name="close-circle"
            size={20}
            color={TEMA.colores.textoSecundario}
            onPress={() => manejarCambioTexto('')}
            accessibilityLabel="Limpiar búsqueda"
            accessibilityRole="button"
          />
        )}
      </View>

      {cargando ? (
        <EstadoCargando mensaje="Buscando en el catálogo..." />
      ) : (
        <FlatList
          data={resultados}
          keyExtractor={(item) => item.isbn}
          renderItem={renderItem}
          ListEmptyComponent={
            consultaUrl.trim().length === 0 ? (
              <EstadoVacio
                mensaje="Escribí un título o autor"
                descripcion="Podés buscar autores como Borges, Cortázar, García Márquez, etc."
              />
            ) : (
              <EstadoVacio
                mensaje={`No encontramos resultados para "${consultaUrl}"`}
                descripcion="Verificá la ortografía o probá con otro término de búsqueda."
              />
            )
          }
          contentContainerStyle={estilos.listaContenido}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: TEMA.colores.fondo,
  },
  contenedorInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TEMA.colores.superficie,
    margin: TEMA.espaciados.lg,
    paddingHorizontal: TEMA.espaciados.md,
    borderRadius: TEMA.bordes.md,
    borderWidth: 1,
    borderColor: TEMA.colores.borde,
    minHeight: TEMA.accesibilidad.areaMinima,
    gap: TEMA.espaciados.sm,
  },
  input: {
    flex: 1,
    fontSize: TEMA.tipografia.md,
    color: TEMA.colores.texto,
    minHeight: TEMA.accesibilidad.areaMinima,
  },
  listaContenido: {
    paddingBottom: TEMA.espaciados.xxl,
  },
});
