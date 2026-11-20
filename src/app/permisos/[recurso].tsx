import React from 'react';
import { View, Text, StyleSheet, Linking, Keyboard } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePermiso, type TipoRecurso } from '../../hooks/usePermiso';
import { Boton } from '../../components/Boton';
import { TEMA } from '../../constants/tema';

export default function PantallaPermisoRecurso() {
  const { recurso } = useLocalSearchParams<{ recurso: string }>();
  const tipoRecurso: TipoRecurso =
    recurso === 'notificaciones' ? 'notificaciones' : 'camara';

  const { estado, esBloqueado, esConcedido, pedirPermiso } = usePermiso(
    tipoRecurso,
  );

  const esCamara = tipoRecurso === 'camara';

  const titulo = esCamara
    ? 'Permiso de Cámara'
    : 'Permiso de Notificaciones';

  const beneficio = esCamara
    ? 'Usamos tu cámara para escanear el código de barras de los libros de forma rápida.'
    : 'Usamos tus notificaciones para recordarte la fecha límite de devolución de tus libros prestados';

  // Línea clave evaluada en D1 b): decisión entre "Abrir Ajustes" o "Continuar"
  const textoBoton = esBloqueado ? 'Abrir Ajustes' : 'Continuar';

  const manejarAccion = async () => {
    if (esBloqueado) {
      await Linking.openSettings();
      return;
    }

    const resultado = await pedirPermiso();
    if (resultado?.granted) {
      if (esCamara) {
        router.replace('/escanear');
      } else {
        router.back();
      }
    } else {
      router.back();
    }
  };

  const manejarReiniciarPermiso = async () => {
    // Solicitar el permiso nuevamente para restablecer el estado
    const resultado = await pedirPermiso();
    if (resultado?.granted) {
      if (esCamara) {
        router.replace('/escanear');
      } else {
        router.back();
      }
    }
  };

  return (
    <View style={estilos.contenedor}>
      <View style={estilos.tarjeta}>
        <View style={estilos.iconoCirculo}>
          <Ionicons
            name={esCamara ? 'camera' : 'notifications'}
            size={48}
            color={TEMA.colores.primario}
          />
        </View>

        <Text style={estilos.titulo}>{titulo}</Text>

        <Text style={estilos.beneficio}>{beneficio}</Text>

        {esBloqueado && (
          <View style={estilos.cajaBloqueado}>
            <Text style={estilos.textoBloqueado}>
              El permiso se encuentra denegado en el sistema operativo. Para
              activarlo, ingresá a Ajustes de la aplicación.
            </Text>
          </View>
        )}

        <View style={estilos.acciones}>
          <Boton
            titulo={textoBoton}
            onPress={manejarAccion}
            variante={esBloqueado ? 'secundario' : 'primario'}
          />

          <View style={estilos.espaciador} />

          {esBloqueado && (
            <Boton
              titulo="Reiniciar solicitud de permiso"
              onPress={manejarReiniciarPermiso}
              variante="borde"
            />
          )}

          <Boton
            titulo="Ahora no"
            onPress={() => router.back()}
            variante="borde"
          />
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
  iconoCirculo: {
    width: 88,
    height: 88,
    borderRadius: TEMA.bordes.full,
    backgroundColor: TEMA.colores.primarioClaro,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: TEMA.espaciados.lg,
  },
  titulo: {
    fontSize: TEMA.tipografia.xl,
    fontWeight: 'bold',
    color: TEMA.colores.texto,
    marginBottom: TEMA.espaciados.md,
    textAlign: 'center',
  },
  beneficio: {
    fontSize: TEMA.tipografia.md,
    color: TEMA.colores.textoSecundario,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: TEMA.espaciados.xl,
  },
  cajaBloqueado: {
    backgroundColor: TEMA.colores.advertenciaFondo,
    borderRadius: TEMA.bordes.md,
    padding: TEMA.espaciados.md,
    borderWidth: 1,
    borderColor: TEMA.colores.advertencia,
    marginBottom: TEMA.espaciados.lg,
  },
  textoBloqueado: {
    fontSize: TEMA.tipografia.sm,
    color: TEMA.colores.advertencia,
    textAlign: 'center',
  },
  acciones: {
    width: '100%',
  },
  espaciador: {
    height: TEMA.espaciados.sm,
  },
});