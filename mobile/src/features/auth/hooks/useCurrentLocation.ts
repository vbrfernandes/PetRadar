import { useCallback } from 'react';
import * as Location from 'expo-location';

import type { CurrentLocation } from '../types/auth.types';

export function useCurrentLocation() {
  const getCurrentLocation = useCallback(async (): Promise<CurrentLocation> => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      return { lat: null, lng: null };
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    };
  }, []);

  return { getCurrentLocation };
}
