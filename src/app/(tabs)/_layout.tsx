import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TEMA } from '../../constants/tema';

export const unstable_settings = {
  initialRouteName: '(catalogo)',
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: TEMA.colores.primario,
        tabBarInactiveTintColor: TEMA.colores.deshabilitado,
        tabBarStyle: {
          backgroundColor: TEMA.colores.superficie,
          borderTopColor: TEMA.colores.borde,
          minHeight: 56,
          paddingBottom: 6,
        },
        tabBarLabelStyle: {
          fontSize: TEMA.tipografia.xs,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="(catalogo)"
        options={{
          title: 'Catálogo',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: 'Pestaña de Catálogo de libros',
        }}
      />
      <Tabs.Screen
        name="reservas"
        options={{
          title: 'Mis reservas',
          headerShown: true,
          headerStyle: {
            backgroundColor: TEMA.colores.superficie,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: TEMA.colores.texto,
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark-outline" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: 'Pestaña de Mis reservas y préstamos',
        }}
      />
    </Tabs>
  );
}
