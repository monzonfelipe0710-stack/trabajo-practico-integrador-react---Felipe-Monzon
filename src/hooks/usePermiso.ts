import { useState, useEffect, useCallback } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import * as Notifications from 'expo-notifications';
import type { PermisoEstado } from '../types';

export type TipoRecurso = 'camara' | 'notificaciones';

export function usePermiso(recurso: TipoRecurso) {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [notifResponse, setNotifResponse] =
    useState<Notifications.NotificationPermissionsStatus | null>(null);
  const [cargandoNotif, setCargandoNotif] = useState<boolean>(true);

  const consultarNotificaciones = useCallback(async () => {
    try {
      const res = await Notifications.getPermissionsAsync();
      setNotifResponse(res);
    } finally {
      setCargandoNotif(false);
    }
  }, []);

  const pedirNotificaciones = useCallback(async () => {
    try {
      const res = await Notifications.requestPermissionsAsync();
      setNotifResponse(res);
      return res;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (recurso === 'notificaciones') {
      consultarNotificaciones();
    }
  }, [recurso, consultarNotificaciones]);

  // Escuchar AppState para detectar cuando la persona vuelve de Ajustes del sistema
  useEffect(() => {
    const suscripcion = AppState.addEventListener(
      'change',
      (estado: AppStateStatus) => {
        if (estado === 'active') {
          if (recurso === 'camara') {
            requestCameraPermission();
          } else {
            consultarNotificaciones();
          }
        }
      },
    );

    return () => {
      suscripcion.remove();
    };
  }, [recurso, requestCameraPermission, consultarNotificaciones]);

  let estado: PermisoEstado = 'cargando';
  let canAskAgain = true;
  let status: 'granted' | 'denied' | 'undetermined' = 'undetermined';

  if (recurso === 'camara') {
    if (!cameraPermission) {
      estado = 'cargando';
    } else {
      status = cameraPermission.status as
        | 'granted'
        | 'denied'
        | 'undetermined';
      canAskAgain = cameraPermission.canAskAgain;
      if (cameraPermission.granted) {
        estado = 'concedido';
      } else if (
        cameraPermission.canAskAgain ||
        cameraPermission.status === 'undetermined'
      ) {
        estado = 'preguntable';
      } else {
        estado = 'bloqueado';
      }
    }
  } else {
    if (cargandoNotif || !notifResponse) {
      estado = 'cargando';
    } else {
      status = notifResponse.status as
        | 'granted'
        | 'denied'
        | 'undetermined';
      canAskAgain = notifResponse.canAskAgain;
      if (notifResponse.granted) {
        estado = 'concedido';
      } else if (
        notifResponse.canAskAgain ||
        notifResponse.status === 'undetermined'
      ) {
        estado = 'preguntable';
      } else {
        estado = 'bloqueado';
      }
    }
  }

  const pedirPermiso = useCallback(async () => {
    if (recurso === 'camara') {
      return await requestCameraPermission();
    } else {
      return await pedirNotificaciones();
    }
  }, [recurso, requestCameraPermission, pedirNotificaciones]);

  return {
    estado,
    status,
    canAskAgain,
    pedirPermiso,
    esBloqueado: estado === 'bloqueado',
    esConcedido: estado === 'concedido',
  };
}
