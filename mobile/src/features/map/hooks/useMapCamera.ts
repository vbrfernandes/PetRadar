import { useCallback, useEffect, useRef, useState } from "react";
import type * as Location from "expo-location";
import Mapbox from "@rnmapbox/maps";

import { INITIAL_ZOOM } from "../constants/map.constants";

interface UseMapCameraParams {
  userLocation: Location.LocationObject | null;
  obterLocalizacaoInicial: () => Promise<void>;
}

export const useMapCamera = ({
  userLocation,
  obterLocalizacaoInicial,
}: UseMapCameraParams) => {
  const mapRef = useRef<Mapbox.MapView | null>(null);
  const cameraRef = useRef<Mapbox.Camera | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapReady || !userLocation) {
      return;
    }

    const coordinate: [number, number] = [
      userLocation.coords.longitude,
      userLocation.coords.latitude,
    ];

    cameraRef.current?.setCamera({
      centerCoordinate: coordinate,
      zoomLevel: INITIAL_ZOOM,
      animationDuration: 1000,
      animationMode: "flyTo",
    });
  }, [mapReady, userLocation]);

  const recentralizarMapa = useCallback(async () => {
    if (!userLocation) {
      await obterLocalizacaoInicial();
      return;
    }

    if (!mapReady) {
      return;
    }

    const coordinate: [number, number] = [
      userLocation.coords.longitude,
      userLocation.coords.latitude,
    ];

    cameraRef.current?.setCamera({
      centerCoordinate: coordinate,
      zoomLevel: INITIAL_ZOOM,
      animationDuration: 800,
      animationMode: "flyTo",
    });
  }, [mapReady, obterLocalizacaoInicial, userLocation]);

  const alterarZoom = useCallback(async (zoomIn: boolean) => {
    try {
      const zoomAtual = await mapRef.current?.getZoom();

      if (zoomAtual === undefined || zoomAtual === null) {
        return;
      }

      const novoZoom = Math.max(3, Math.min(20, zoomAtual + (zoomIn ? 1 : -1)));

      cameraRef.current?.zoomTo(novoZoom, 250);
    } catch (error) {
      console.warn("Erro ao alterar zoom:", error);
    }
  }, []);

  const marcarMapaPronto = useCallback(() => {
    setMapReady(true);
  }, []);

  return {
    mapRef,
    cameraRef,
    recentralizarMapa,
    alterarZoom,
    marcarMapaPronto,
  };
};
