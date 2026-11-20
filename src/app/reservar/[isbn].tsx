import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LIBROS } from '../../data/libros';
import { useBiblioteca } from '../../context/BibliotecaContext';
import { Boton } from '../../components/Boton';
import { TEMA } from '../../constants/tema';

export default function PantallaReservarConfirmacion() {
  const { isbn } = useLocalSearchParams<{ isbn: string }>();
  const {
    reservarLibro,
    obtenerEjemplaresDisponibles,
    obtenerPersonasEnEspera,
    estaPrestadoOReservado,
  } = useBiblioteca();

  const libro = useMemo(() => {
    return LIBROS.find((l) => l.isbn === isbn);
  }, [isbn]);

  if (!libro) {
    return (
      <View style={estilos.contenedor}>
        <View style={estilos.tarjeta}>
          <Text style={estilos.titulo}>Libro inexistente</Text>
          <Text style={estilos.descripcion}>
            No pudimos identificar el libro para realizar la reserva.
          </Text>
          <Boton titulo="Cerrar" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  const disponibles = obtenerEjemplaresDisponibles(libro.isbn);
  const personasEnEspera = obtenerPersonasEnEspera(libro.isbn);
  const yaSolicitado = estaPrestadoOReservado(libro.isbn);
  const esPrestamoInmediato = disponibles > 0;

  const manejarConfirmar = () => {
    const resultado = reservarLibro(libro.isbn);

    if (resultado.exito) {
      // Usamos router.replace para que "atrás" en Android no vuelva a la pantalla de confirmación (C1 a)
      router.replace('/reservas');
    }
  };

  return (
    <View style={estilos.contenedor}>
      <View style={estilos.tarjeta}>
        <View
          style={[
            estilos.iconoCirculo,
            esPrestamoInmediato
              ? estilos.iconoCirculoExito
              : estilos.iconoCirculoEspera,
          ]}
        >
          <Ionicons
            name={esPrestamoInmediato ? 'calendar-outline' : 'people-outline'}
            size={44}
            color={
              esPrestamoInmediato
                ? TEMA.colores.exito
                : TEMA.colores.advertencia
            }
          />
        </View>

        <Text style={estilos.titulo}>
          {esPrestamoInmediato
            ? 'Confirmar Préstamo'
            : 'Unirse a Lista de Espera'}
        </Text>

        <Text style={estilos.nombreLibro}>{libro.titulo}</Text>
        <Text style={estilos.autorLibro}>{libro.autor}</Text>

        <View style={estilos.cajaDetalle}>
          {esPrestamoInmediato ? (
            <View>
              <Text style={estilos.textoDetalle}>
                • Hay <Text style={estilos.negrita}>{disponibles}</Text>{' '}
                {disponibles === 1 ? 'ejemplar disponible' : 'ejemplares disponibles'}.
              </Text>
              <Text style={estilos.textoDetalle}>
                • Plazo de préstamo:{' '}
                <Text style={estilos.negrita}>7 días corridos</Text>.
              </Text>
              <Text style={estilos.textoDetalle}>
                • Podrás activar un recordatorio de devolución al confirmar.
              </Text>
            </View>
          ) : (
            <View>
              <Text style={estilos.textoDetalle}>
                • Actualmente{' '}
                <Text style={estilos.negrita}>no hay stock físico</Text> en el
                estante.
              </Text>
              <Text style={estilos.textoDetalle}>
                • Ingresarás a la cola en la posición:{' '}
                <Text style={estilos.negrita}>#{personasEnEspera + 1}</Text>.
              </Text>
              <Text style={estilos.textoDetalle}>
                • Se te notificará cuando se devuelva un ejemplar y llegue tu
                turno.
              </Text>
            </View>
          )}
        </View>

        {yaSolicitado ? (
          <View style={estilos.cajaAlerta}>
            <Text style={estilos.textoAlerta}>
              Ya contás con un préstamo o reserva activa para este libro.
            </Text>
            <Boton
              titulo="Volver"
              onPress={() => router.back()}
              variante="borde"
            />
          </View>
        ) : (
          <View style={estilos.acciones}>
            <Boton
              titulo={
                esPrestamoInmediato
                  ? 'Confirmar Préstamo'
                  : 'Confirmar e Ingresar a Espera'
              }
              onPress={manejarConfirmar}
              variante={esPrestamoInmediato ? 'primario' : 'secundario'}
            />
            <View style={estilos.espaciador} />
            <Boton
              titulo="Cancelar"
              onPress={() => router.back()}
              variante="borde"
            />
          </View>
        )}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
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
  iconoCirculo: {
    width: 80,
    height: 80,
    borderRadius: TEMA.bordes.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: TEMA.espaciados.md,
  },
  iconoCirculoExito: {
    backgroundColor: TEMA.colores.exitoFondo,
  },
  iconoCirculoEspera: {
    backgroundColor: TEMA.colores.advertenciaFondo,
  },
  titulo: {
    fontSize: TEMA.tipografia.xl,
    fontWeight: 'bold',
    color: TEMA.colores.texto,
    marginBottom: TEMA.espaciados.xs,
    textAlign: 'center',
  },
  nombreLibro: {
    fontSize: TEMA.tipografia.lg,
    fontWeight: '600',
    color: TEMA.colores.primario,
    textAlign: 'center',
  },
  autorLibro: {
    fontSize: TEMA.tipografia.sm,
    color: TEMA.colores.textoSecundario,
    marginBottom: TEMA.espaciados.lg,
    textAlign: 'center',
  },
  cajaDetalle: {
    backgroundColor: TEMA.colores.fondo,
    borderRadius: TEMA.bordes.md,
    padding: TEMA.espaciados.md,
    width: '100%',
    marginBottom: TEMA.espaciados.xl,
    borderWidth: 1,
    borderColor: TEMA.colores.borde,
  },
  textoDetalle: {
    fontSize: TEMA.tipografia.sm,
    color: TEMA.colores.texto,
    marginBottom: TEMA.espaciados.xs,
    lineHeight: 20,
  },
  negrita: {
    fontWeight: 'bold',
    color: TEMA.colores.primario,
  },
  acciones: {
    width: '100%',
  },
  espaciador: {
    height: TEMA.espaciados.sm,
  },
  cajaAlerta: {
    width: '100%',
    gap: TEMA.espaciados.md,
  },
  textoAlerta: {
    color: TEMA.colores.error,
    fontSize: TEMA.tipografia.sm,
    textAlign: 'center',
    fontWeight: '600',
  },
});
