import React from 'react';
import { Redirect } from 'expo-router';

// Requisito A1: URL vieja de la versión anterior que redirige a /reservas
export default function RedireccionReserva() {
  return <Redirect href="/reservas" />;
}
