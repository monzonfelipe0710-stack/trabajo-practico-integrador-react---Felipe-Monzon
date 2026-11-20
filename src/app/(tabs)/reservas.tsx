import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  ScrollView,
  StyleSheet,
  AppState,
  type AppStateStatus,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';
import { useBiblioteca } from '../../context/BibliotecaContext';
import { Boton } from '../../components/Boton';
import { EstadoVacio } from '../../components/EstadoVacio';
import type { Prestamo, ReservaEspera } from '../../types';
import { TEMA } from '../../constants/tema';

export default function PantallaMisReservas() {
  const {
    prestamos,
    reservasEnEspera,
    avisosEnApp,
    devolverLibro,
    alternarRecordatorio,
    eliminarAviso,
  } = useBiblioteca();

  const [permisoNotificaciones, setPermisoNotificaciones] =
    useState<boolean>(false);

  // C4: Consultar estado de permisos de notificación
  const verificarPermisos = useCallback(async () => {
    try {
      const res = await Notifications.getPermissionsAsync();
      setPermisoNotificaciones(res.granted);
    } catch {
      setPermisoNotificaciones(false);
    }
  }, []);

  // C4 a) y b): useFocusEffect se ejecuta cada vez que el usuario ingresa a esta pestaña
  useFocusEffect(
    useCallback(() => {
      verificarPermisos();
    }, [verificarPermisos]),
  );

  // C4 a) y b): AppState detecta cuando el usuario vuelve de "Ajustes" a la aplicación
  useEffect(() => {
    const sub = AppState.addEventListener(
      'change',
      (siguienteEstado: AppStateStatus) => {
        if (siguienteEstado === 'active') {
          verificarPermisos();
        }
      },
    );
    return () => {
      sub.remove();
    };
  }, [verificarPermisos]);

  const manejarToggleRecordatorio = async (
    isbn: string,
    nuevoValor: boolean,
  ) => {
    const exito = await alternarRecordatorio(isbn, nuevoValor);
    if (nuevoValor && !exito) {
      // Si el permiso fue denegado, actualizar estado de la interfaz
      verificarPermisos();
    }
  };

  return (
    <ScrollView style={estilos.pantalla} contentContainerStyle={estilos.contenido}>
      {/* Estado del permiso de notificaciones (Requisito C4) */}
      <View
        style={[
          estilos.tarjetaEstadoPermiso,
          permisoNotificaciones
            ? estilos.tarjetaPermisoConcedido
            : estilos.tarjetaPermisoDenegado,
        ]}
      >
        <Ionicons
          name={
            permisoNotificaciones
              ? 'notifications-outline'
              : 'notifications-off-outline'
          }
          size={20}
          color={
            permisoNotificaciones ? TEMA.colores.exito : TEMA.colores.advertencia
          }
        />
        <Text style={estilos.textoEstadoPermiso}>
          {permisoNotificaciones
            ? 'Notificaciones locales activadas para avisos y recordatorios.'
            : 'Notificaciones no habilitadas: recibirás los avisos aquí dentro de la app.'}
        </Text>
      </View>

      {/* Avisos recibidos dentro de la app (cuando no hay notificaciones o para avisos en pantalla) */}
      {avisosEnApp.length > 0 && (
        <View style={estilos.seccionAvisos}>
          <Text style={estilos.tituloSeccion}>Avisos de la biblioteca</Text>
          {avisosEnApp.map((aviso, indice) => (
            <View key={indice} style={estilos.tarjetaAviso}>
              <View style={estilos.filaAviso}>
                <Ionicons
                  name="information-circle"
                  size={20}
                  color={TEMA.colores.primario}
                />
                <Text style={estilos.textoAviso}>{aviso}</Text>
                <Ionicons
                  name="close"
                  size={20}
                  color={TEMA.colores.textoSecundario}
                  onPress={() => eliminarAviso(indice)}
                  accessibilityRole="button"
                  accessibilityLabel="Descartar aviso"
                />
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Sección 1: Préstamos activos */}
      <View style={estilos.seccion}>
        <Text style={estilos.tituloSeccion}>
          Mis préstamos en curso ({prestamos.length})
        </Text>

        {prestamos.length === 0 ? (
          <EstadoVacio
            mensaje="No tenés préstamos activos"
            descripcion="Explorá el catálogo para reservar libros disponibles."
          />
        ) : (
          prestamos.map((prestamo: Prestamo) => (
            <View key={prestamo.isbn} style={estilos.tarjetaPrestamo}>
              <View style={estilos.infoPrestamo}>
                <Text style={estilos.tituloLibro}>{prestamo.titulo}</Text>
                <Text style={estilos.autorLibro}>{prestamo.autor}</Text>

                <View style={estilos.filasFechas}>
                  <Text style={estilos.fechaTexto}>
                    Retiro: {prestamo.fechaPrestamo}
                  </Text>
                  <Text style={estilos.fechaDevolucionTexto}>
                    Devolución antes de: {prestamo.fechaDevolucion}
                  </Text>
                </View>
              </View>

              <View style={estilos.filaAcciones}>
                <View style={estilos.contenedorSwitch}>
                  <Text style={estilos.textoSwitch}>Recordarme</Text>
                  <Switch
                    accessibilityLabel={`Activar recordatorio para ${prestamo.titulo}`}
                    value={prestamo.recordatorioActivo}
                    onValueChange={(val) =>
                      manejarToggleRecordatorio(prestamo.isbn, val)
                    }
                    trackColor={{
                      false: TEMA.colores.deshabilitado,
                      true: TEMA.colores.primario,
                    }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                <Boton
                  titulo="Devolver"
                  variante="borde"
                  onPress={() => devolverLibro(prestamo.isbn)}
                />
              </View>

              {prestamo.recordatorioActivo && (
                <Text style={estilos.avisoDemostracion}>
                  ⏱ Recordatorio programado a los 15s (Modo demo)
                </Text>
              )}
            </View>
          ))
        )}
      </View>

      {/* Sección 2: Reservas en espera */}
      <View style={estilos.seccion}>
        <Text style={estilos.tituloSeccion}>
          Mis reservas en lista de espera ({reservasEnEspera.length})
        </Text>

        {reservasEnEspera.length === 0 ? (
          <EstadoVacio
            mensaje="No estás en ninguna lista de espera"
            descripcion="Cuando un libro sin ejemplares sea solicitado, aparecerá aquí tu turno."
          />
        ) : (
          reservasEnEspera.map((reserva: ReservaEspera) => (
            <View key={reserva.isbn} style={estilos.tarjetaEspera}>
              <View style={estilos.infoEspera}>
                <Text style={estilos.tituloLibro}>{reserva.titulo}</Text>
                <Text style={estilos.autorLibro}>{reserva.autor}</Text>
                <Text style={estilos.posicionTexto}>
                  Posición actual en la cola:{' '}
                  <Text style={estilos.posicionNumero}>#{reserva.posicion}</Text>
                </Text>
              </View>

              <View style={estilos.badgeTurno}>
                <Text style={estilos.textoBadgeTurno}>
                  {reserva.posicion === 1 ? '¡Siguiente en turno!' : 'En espera'}
                </Text>
              </View>
            </View>
          ))
        )}
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
    paddingBottom: TEMA.espaciados.xxxl,
  },
  tarjetaEstadoPermiso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: TEMA.espaciados.sm,
    padding: TEMA.espaciados.md,
    borderRadius: TEMA.bordes.md,
    borderWidth: 1,
    marginBottom: TEMA.espaciados.lg,
  },
  tarjetaPermisoConcedido: {
    backgroundColor: TEMA.colores.exitoFondo,
    borderColor: TEMA.colores.exito,
  },
  tarjetaPermisoDenegado: {
    backgroundColor: TEMA.colores.advertenciaFondo,
    borderColor: TEMA.colores.advertencia,
  },
  textoEstadoPermiso: {
    flex: 1,
    fontSize: TEMA.tipografia.xs,
    color: TEMA.colores.texto,
    lineHeight: 18,
  },
  seccionAvisos: {
    marginBottom: TEMA.espaciados.lg,
  },
  tarjetaAviso: {
    backgroundColor: TEMA.colores.primarioClaro,
    borderRadius: TEMA.bordes.md,
    padding: TEMA.espaciados.md,
    marginBottom: TEMA.espaciados.sm,
    borderWidth: 1,
    borderColor: TEMA.colores.primario,
  },
  filaAviso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: TEMA.espaciados.sm,
  },
  textoAviso: {
    flex: 1,
    fontSize: TEMA.tipografia.sm,
    color: TEMA.colores.primarioOscuro,
    fontWeight: '600',
  },
  seccion: {
    marginBottom: TEMA.espaciados.xl,
  },
  tituloSeccion: {
    fontSize: TEMA.tipografia.lg,
    fontWeight: 'bold',
    color: TEMA.colores.texto,
    marginBottom: TEMA.espaciados.md,
  },
  tarjetaPrestamo: {
    backgroundColor: TEMA.colores.superficie,
    borderRadius: TEMA.bordes.lg,
    padding: TEMA.espaciados.lg,
    borderWidth: 1,
    borderColor: TEMA.colores.borde,
    marginBottom: TEMA.espaciados.md,
  },
  infoPrestamo: {
    marginBottom: TEMA.espaciados.md,
  },
  tituloLibro: {
    fontSize: TEMA.tipografia.md,
    fontWeight: 'bold',
    color: TEMA.colores.texto,
  },
  autorLibro: {
    fontSize: TEMA.tipografia.sm,
    color: TEMA.colores.textoSecundario,
    marginBottom: TEMA.espaciados.xs,
  },
  filasFechas: {
    marginTop: TEMA.espaciados.xs,
    gap: 2,
  },
  fechaTexto: {
    fontSize: TEMA.tipografia.xs,
    color: TEMA.colores.textoSecundario,
  },
  fechaDevolucionTexto: {
    fontSize: TEMA.tipografia.sm,
    color: TEMA.colores.primario,
    fontWeight: '600',
  },
  filaAcciones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: TEMA.espaciados.sm,
    borderTopWidth: 1,
    borderTopColor: TEMA.colores.borde,
  },
  contenedorSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: TEMA.espaciados.sm,
    minHeight: TEMA.accesibilidad.areaMinima,
  },
  textoSwitch: {
    fontSize: TEMA.tipografia.sm,
    fontWeight: '600',
    color: TEMA.colores.texto,
  },
  avisoDemostracion: {
    fontSize: TEMA.tipografia.xs,
    color: TEMA.colores.textoSecundario,
    marginTop: TEMA.espaciados.sm,
    fontStyle: 'italic',
  },
  tarjetaEspera: {
    backgroundColor: TEMA.colores.superficie,
    borderRadius: TEMA.bordes.lg,
    padding: TEMA.espaciados.lg,
    borderWidth: 1,
    borderColor: TEMA.colores.borde,
    marginBottom: TEMA.espaciados.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoEspera: {
    flex: 1,
  },
  posicionTexto: {
    fontSize: TEMA.tipografia.sm,
    color: TEMA.colores.texto,
    marginTop: TEMA.espaciados.xs,
  },
  posicionNumero: {
    fontWeight: 'bold',
    color: TEMA.colores.advertencia,
  },
  badgeTurno: {
    backgroundColor: TEMA.colores.advertenciaFondo,
    borderRadius: TEMA.bordes.sm,
    paddingHorizontal: TEMA.espaciados.sm,
    paddingVertical: TEMA.espaciados.xs,
  },
  textoBadgeTurno: {
    fontSize: TEMA.tipografia.xs,
    fontWeight: 'bold',
    color: TEMA.colores.advertencia,
  },
});
