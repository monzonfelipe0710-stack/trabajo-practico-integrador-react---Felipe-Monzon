import React from 'react';
import { Stack } from 'expo-router';
import { TEMA } from '../../../constants/tema';

export default function CatalogoStackLayout() {
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
        name="index"
        options={{
          title: 'Biblioteca IPF',
        }}
      />
      <Stack.Screen
        name="libro/[isbn]"
        options={{
          title: 'Detalle del libro',
          headerBackTitle: 'Catálogo',
        }}
      />
    </Stack>
  );
}
