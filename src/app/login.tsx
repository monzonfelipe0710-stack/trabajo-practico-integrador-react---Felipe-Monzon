import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBiblioteca } from '../context/BibliotecaContext';
import { Boton } from '../components/Boton';
import { TEMA } from '../constants/tema';

export default function PantallaLogin() {
  const { iniciarSesion } = useBiblioteca();
  const [usuarioInput, setUsuarioInput] = useState('');
  const [claveInput, setClaveInput] = useState('');
  const [errorLogin, setErrorLogin] = useState<string | null>(null);

  const manejarIngreso = () => {
    setErrorLogin(null);
    const correcto = iniciarSesion(usuarioInput, claveInput);

    if (correcto) {
      // Al iniciar sesión, el login se cierra solo o navega al mostrador (A3 #8)
      router.replace('/mostrador');
    } else {
      setErrorLogin(
        'El usuario o la contraseña ingresados son incorrectos. Por favor, verificá tus datos.',
      );
    }
  };

  return (
    <ScrollView style={estilos.pantalla} contentContainerStyle={estilos.contenido}>
      <View style={estilos.tarjeta}>
        <View style={estilos.iconoContenedor}>
          <Ionicons
            name="lock-closed-outline"
            size={40}
            color={TEMA.colores.primario}
          />
        </View>

        <Text style={estilos.titulo}>Acceso del Personal</Text>
        <Text style={estilos.subtitulo}>
          Ingreso reservado a bibliotecarios y administradores del Instituto.
        </Text>

        <View style={estilos.cajaAyuda}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={TEMA.colores.primario}
          />
          <Text style={estilos.textoAyuda}>
            Credenciales de demostración: usuario <Text style={estilos.negrita}>admin</Text> y clave <Text style={estilos.negrita}>1234</Text>.
          </Text>
        </View>

        {errorLogin && (
          <View style={estilos.cajaError}>
            <Ionicons
              name="alert-circle"
              size={18}
              color={TEMA.colores.error}
            />
            <Text style={estilos.textoError}>{errorLogin}</Text>
          </View>
        )}

        <View style={estilos.formulario}>
          <Text style={estilos.etiqueta}>Usuario</Text>
          <TextInput
            style={estilos.input}
            placeholder="Ingresá tu usuario"
            placeholderTextColor={TEMA.colores.textoSecundario}
            value={usuarioInput}
            onChangeText={(txt) => {
              setUsuarioInput(txt);
              setErrorLogin(null);
            }}
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Campo de nombre de usuario de personal"
          />

          <Text style={estilos.etiqueta}>Contraseña</Text>
          <TextInput
            style={estilos.input}
            placeholder="Ingresá tu clave"
            placeholderTextColor={TEMA.colores.textoSecundario}
            value={claveInput}
            onChangeText={(txt) => {
              setClaveInput(txt);
              setErrorLogin(null);
            }}
            secureTextEntry
            accessibilityLabel="Campo de contraseña de personal"
          />

          <View style={estilos.botones}>
            <Boton titulo="Iniciar Sesión" onPress={manejarIngreso} />
            <View style={estilos.espaciador} />
            <Boton
              titulo="Cancelar"
              onPress={() => router.back()}
              variante="borde"
            />
          </View>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  tarjeta: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: TEMA.colores.superficie,
    borderRadius: TEMA.bordes.xl,
    padding: TEMA.espaciados.xl,
    borderWidth: 1,
    borderColor: TEMA.colores.borde,
    alignItems: 'center',
  },
  iconoContenedor: {
    width: 72,
    height: 72,
    borderRadius: TEMA.bordes.full,
    backgroundColor: TEMA.colores.primarioClaro,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: TEMA.espaciados.md,
  },
  titulo: {
    fontSize: TEMA.tipografia.xl,
    fontWeight: 'bold',
    color: TEMA.colores.texto,
    marginBottom: TEMA.espaciados.xs,
  },
  subtitulo: {
    fontSize: TEMA.tipografia.sm,
    color: TEMA.colores.textoSecundario,
    textAlign: 'center',
    marginBottom: TEMA.espaciados.lg,
  },
  cajaAyuda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: TEMA.espaciados.sm,
    backgroundColor: TEMA.colores.fondo,
    padding: TEMA.espaciados.md,
    borderRadius: TEMA.bordes.md,
    borderWidth: 1,
    borderColor: TEMA.colores.borde,
    marginBottom: TEMA.espaciados.md,
    width: '100%',
  },
  textoAyuda: {
    fontSize: TEMA.tipografia.xs,
    color: TEMA.colores.textoSecundario,
    flex: 1,
  },
  negrita: {
    fontWeight: 'bold',
    color: TEMA.colores.primario,
  },
  cajaError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: TEMA.espaciados.sm,
    backgroundColor: TEMA.colores.errorFondo,
    padding: TEMA.espaciados.md,
    borderRadius: TEMA.bordes.md,
    borderWidth: 1,
    borderColor: TEMA.colores.error,
    marginBottom: TEMA.espaciados.md,
    width: '100%',
  },
  textoError: {
    fontSize: TEMA.tipografia.xs,
    color: TEMA.colores.error,
    fontWeight: '600',
    flex: 1,
  },
  formulario: {
    width: '100%',
  },
  etiqueta: {
    fontSize: TEMA.tipografia.sm,
    fontWeight: '600',
    color: TEMA.colores.texto,
    marginBottom: TEMA.espaciados.xs,
    marginTop: TEMA.espaciados.sm,
  },
  input: {
    backgroundColor: TEMA.colores.fondo,
    borderRadius: TEMA.bordes.md,
    borderWidth: 1,
    borderColor: TEMA.colores.borde,
    paddingHorizontal: TEMA.espaciados.md,
    fontSize: TEMA.tipografia.md,
    minHeight: TEMA.accesibilidad.areaMinima,
    color: TEMA.colores.texto,
  },
  botones: {
    marginTop: TEMA.espaciados.xl,
  },
  espaciador: {
    height: TEMA.espaciados.sm,
  },
});
