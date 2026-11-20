import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  BibliotecaProvider,
  useBiblioteca,
} from '../context/BibliotecaContext';
import { configurarCanalNotificaciones } from '../lib/notificaciones';
import { TEMA } from '../constants/tema';

function NavegadorPrincipal() {
  const { usuario } = useBiblioteca();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: TEMA.colores.superficie,
        },
        headerTintColor: TEMA.colores.primario,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: TEMA.colores.texto,
        },
        contentStyle: {
          backgroundColor: TEMA.colores.fondo,
        },
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="buscar"
        options={{
          title: 'Buscar libros',
          headerBackTitle: 'Atrás',
        }}
      />
      <Stack.Screen
        name="escanear"
        options={{
          title: 'Escanear código de barras',
          headerBackTitle: 'Atrás',
        }}
      />
      <Stack.Screen
        name="reservar/[isbn]"
        options={{
          title: 'Confirmar Reserva',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="permisos/[recurso]"
        options={{
          title: 'Permiso requerido',
          presentation: 'modal',
        }}
      />
      {usuario === null ? (
        <Stack.Screen
          name="login"
          options={{
            title: 'Acceso del Personal',
            presentation: 'modal',
          }}
        />
      ) : (
        <Stack.Screen
          name="mostrador"
          options={{
            title: 'Mostrador de Entrega',
            headerBackTitle: 'Atrás',
          }}
        />
      )}
      <Stack.Screen
        name="reserva"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="+not-found"
        options={{
          title: 'Página no encontrada',
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    configurarCanalNotificaciones();
  }, []);

  return (
    <BibliotecaProvider>
      <StatusBar style="dark" />
      <NavegadorPrincipal />
    </BibliotecaProvider>
  );
}
