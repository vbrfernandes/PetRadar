import { MAPBOX_ACCESS_TOKEN } from "../constants/occurrence.constants";
import type { RespostaGeocodingMapbox } from "../types/occurrenceForm.types";

export const occurrenceGeocodingService = {
  async search(texto: string): Promise<RespostaGeocodingMapbox> {
    if (!MAPBOX_ACCESS_TOKEN) {
      throw new Error("MAPBOX_TOKEN_NOT_CONFIGURED");
    }

    const parametros = new URLSearchParams({
      q: texto,
      access_token: MAPBOX_ACCESS_TOKEN,
      autocomplete: "true",
      country: "br",
      language: "pt",
      limit: "5",
      types: "address,street,place,locality,neighborhood",
    });

    const response = await fetch(
      `https://api.mapbox.com/search/geocode/v6/forward?${parametros.toString()}`,
    );

    if (!response.ok) {
      throw new Error(`Mapbox retornou HTTP ${response.status}`);
    }

    return (await response.json()) as RespostaGeocodingMapbox;
  },
};
