import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Linking,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { CameraView, type BarcodeScanningResult } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { usePermiso } from '../hooks/usePermiso';
import { LIBROS } from '../data/libros';
import { Boton } from '../components/Boton';
import { EstadoCargando } from '../components/EstadoCargando';
import { TEMA } from '../constants/tema';

export default function PantallaEscanear() {
  const { estado, esBloqueado, esConcedido, pedirPermiso } =
    usePermiso('camara');

  const [isbnManual, setIsbnManual] = useState('');
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);

  // useRef para evitar que onBarcodeScanned dispare múltiples navegaciones en ráfaga (TP 2 y C2)
  const procesandoEscaneo = useRef(false);

  const manejarCodigoBarras = ({ data }: BarcodeScanningResult) => {
    if (procesandoEscaneo.current) {
      return;
    }
    procesandoEscaneo.current = true;

    const limpio = data.trim();
    const encontrado = LIBROS.find((l) => l.isbn === limpio);

    if (encontrado) {
      // Reemplaza la pantalla para que "atrás" vuelva al catálogo y no al escáner
      router.replace(`/libro/${encontrado.isbn}`);
    } else {
      setErrorMensaje(
        `El código escaneado (${limpio}) no pertenece a un libro de nuestro catálogo.`,
      );
      // Tras 2.5 segundos permitimos volver a escanear
      setTimeout(() => {
        procesandoEscaneo.current = false;
        setErrorMensaje(null);
      }, 2500);
    }
  };

  const manejarBusquedaManual = () => {
    const limpio = isbnManual.trim();
    if (!/^\d{13}$/.test(limpio)) {
      setErrorMensaje('El ISBN debe contener exactamente 13 dígitos numéricos.');
      return;
    }

    const encontrado = LIBROS.find((l) => l.isbn === limpio);
    if (encontrado) {
      router.replace(`/libro/${encontrado.isbn}`);
    } else {
      setErrorMensaje(`No encontramos ningún libro con el ISBN ${limpio}.`);
    }
  };

  return (
    <ScrollView style={estilos.pantalla} contentContainerStyle={estilos.contenido}>
      {/* 1. Visor de Cámara según los cuatro estados */}
      <View style={estilos.contenedorCamara}>
        {estado === 'cargando' ? (
          <EstadoCargando mensaje="Iniciando cámara..." />
        ) : esConcedido ? (
          <CameraView
            style={estilos.camara}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['ean13'],
            }}
            onBarcodeScanned={manejarCodigoBarras}
          >
            <View style={estilos.mascaraEscaneo}>
              <View style={estilos.cuadroEnfoque} />
              <Text style={estilos.instruccionCamara}>
                Apuntá al código de barras EAN-13
              </Text>
            </View>
          </CameraView>
        ) : esBloqueado ? (
          <View style={estilos.avisoPermiso}>
            <Ionicons
              name="lock-closed"
              size={40}
              color={TEMA.colores.advertencia}
            />
            <Text style={estilos.tituloPermiso}>Cámara bloqueada</Text>
            <Text style={estilos.descripcionPermiso}>
              El acceso a la cámara está denegado en los ajustes del sistema.
              Podés habilitarlo o ingresar el ISBN manualmente abajo.
            </Text>
            <Boton
              titulo="Abrir Ajustes"
              onPress={() => Linking.openSettings()}
              variante="secundario"
            />
          </View>
        ) : (
          <View style={estilos.avisoPermiso}>
            <Ionicons
              name="camera-outline"
              size={40}
              color={TEMA.colores.primario}
            />
            <Text style={estilos.tituloPermiso}>Permiso necesario</Text>
            <Text style={estilos.descripcionPermiso}>
              Para leer códigos de barras directamente con tu teléfono se
              requiere acceso a la cámara.
            </Text>
            <Boton
              titulo="Conceder Permiso"
              onPress={pedirPermiso}
              variante="primario"
            />
          </View>
        )}
      </View>

      {/* Aviso de error si el ISBN escaneado o ingresado no existe */}
      {errorMensaje && (
        <View style={estilos.cajaError}>
          <Ionicons
            name="alert-circle"
            size={20}
            color={TEMA.colores.error}
          />
          <Text style={estilos.textoError}>{errorMensaje}</Text>
        </View>
      )}

      {/* 2. Opción de ingresar ISBN a mano (A3 #6 y A3 #9: la app nunca se bloquea) */}
      <View style={estilos.seccionManual}>
        <Text style={estilos.tituloManual}>O ingresá el ISBN a mano</Text>
        <Text style={estilos.subtituloManual}>
          Ingresá los 13 dígitos del libro sin guiones
        </Text>

        <View style={estilos.filaManual}>
          <TextInput
            style={estilos.inputIsbn}
            placeholder="Ej: 9789500700146"
            placeholderTextColor={TEMA.colores.textoSecundario}
            value={isbnManual}
            onChangeText={(texto) => {
              setIsbnManual(texto);
              setErrorMensaje(null);
            }}
            keyboardType="number-pad"
            maxLength={13}
            accessibilityLabel="Ingreso manual de código ISBN"
          />
          <Boton
            titulo="Buscar"
            onPress={manejarBusquedaManual}
            deshabilitado={isbnManual.trim().length !== 13}
          />
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
  contenedorCamara: {
    height: 320,
    borderRadius: TEMA.bordes.xl,
    overflow: 'hidden',
    backgroundColor: '#000000',
    marginBottom: TEMA.espaciados.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camara: {
    width: '100%',
    height: '100%',
  },
  mascaraEscaneo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cuadroEnfoque: {
    width: 240,
    height: 120,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: TEMA.bordes.md,
    backgroundColor: 'transparent',
  },
  instruccionCamara: {
    marginTop: TEMA.espaciados.md,
    color: '#FFFFFF',
    fontSize: TEMA.tipografia.sm,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: TEMA.espaciados.md,
    paddingVertical: TEMA.espaciados.xs,
    borderRadius: TEMA.bordes.sm,
  },
  avisoPermiso: {
    padding: TEMA.espaciados.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TEMA.colores.superficie,
    width: '100%',
    height: '100%',
  },
  tituloPermiso: {
    fontSize: TEMA.tipografia.lg,
    fontWeight: 'bold',
    color: TEMA.colores.texto,
    marginTop: TEMA.espaciados.md,
    marginBottom: TEMA.espaciados.xs,
  },
  descripcionPermiso: {
    fontSize: TEMA.tipografia.sm,
    color: TEMA.colores.textoSecundario,
    textAlign: 'center',
    marginBottom: TEMA.espaciados.lg,
    lineHeight: 20,
  },
  cajaError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: TEMA.espaciados.sm,
    backgroundColor: TEMA.colores.errorFondo,
    borderColor: TEMA.colores.error,
    borderWidth: 1,
    borderRadius: TEMA.bordes.md,
    padding: TEMA.espaciados.md,
    marginBottom: TEMA.espaciados.lg,
  },
  textoError: {
    flex: 1,
    fontSize: TEMA.tipografia.sm,
    color: TEMA.colores.error,
    fontWeight: '600',
  },
  seccionManual: {
    backgroundColor: TEMA.colores.superficie,
    borderRadius: TEMA.bordes.lg,
    padding: TEMA.espaciados.lg,
    borderWidth: 1,
    borderColor: TEMA.colores.borde,
  },
  tituloManual: {
    fontSize: TEMA.tipografia.md,
    fontWeight: 'bold',
    color: TEMA.colores.texto,
    marginBottom: TEMA.espaciados.xs,
  },
  subtituloManual: {
    fontSize: TEMA.tipografia.sm,
    color: TEMA.colores.textoSecundario,
    marginBottom: TEMA.espaciados.md,
  },
  filaManual: {
    flexDirection: 'row',
    gap: TEMA.espaciados.sm,
  },
  inputIsbn: {
    flex: 1,
    backgroundColor: TEMA.colores.fondo,
    borderRadius: TEMA.bordes.md,
    borderWidth: 1,
    borderColor: TEMA.colores.borde,
    paddingHorizontal: TEMA.espaciados.md,
    fontSize: TEMA.tipografia.md,
    minHeight: TEMA.accesibilidad.areaMinima,
    color: TEMA.colores.texto,
  },
});
