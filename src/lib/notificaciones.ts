import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function configurarCanalNotificaciones(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('prestamos', {
      name: 'Préstamos y Devoluciones',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#1E40AF',
    });
  }
}

export async function programarRecordatorioDevolucion(
  tituloLibro: string,
): Promise<string> {
  await configurarCanalNotificaciones();
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Biblioteca IPF - Recordatorio',
      body: `Faltan pocos días para la devolución de "${tituloLibro}".`,
      data: { tipo: 'recordatorio' },
      channelId: 'prestamos',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 15, // Modo demostración (15 segundos)
      repeats: false,
    },
  });
  return id;
}

export async function cancelarRecordatorio(
  notificacionId: string,
): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificacionId);
  } catch {
    // Silencioso si ya no existe o ya disparó
  }
}

export async function notificarLibroDisponible(
  tituloLibro: string,
): Promise<void> {
  await configurarCanalNotificaciones();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '¡Libro disponible para vos!',
      body: `Ya podés retirar "${tituloLibro}" en el mostrador de la biblioteca.`,
      data: { tipo: 'disponibilidad' },
      channelId: 'prestamos',
    },
    trigger: null, // Disparo inmediato
  });
}
