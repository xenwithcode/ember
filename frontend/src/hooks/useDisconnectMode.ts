// frontend/src/hooks/useDisconnectMode.ts
"use client";

import { useState, useEffect, useCallback } from "react";

export interface NearbyPlace {
  id: string;
  name: string;
  category: "nature" | "library" | "cafe" | "sports" | "community";
  emoji: string;
  distance: string;
  walkTime: string;
  description: string;
  challenge: string;
  // NUEVOS campos reales
  googlePlaceId?: string;
  address?: string;
  rating?: number;
  openNow?: boolean;
  mapsUrl?: string;
}

export interface DisconnectResult {
  activated: boolean;
  nearbyPlaces: NearbyPlace[];
  challengeTitle: string;
  challengeDescription: string;
  gemmaInsight: string;
  medalId?: string;
  usingRealData: boolean; // ← Indica si usamos API real o mock
}

const STORAGE_KEY = "ember_disconnect_missions";
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

// Mapeo de tipos de Google Places a nuestras categorías
const PLACE_TYPE_MAPPING: Record<
  string,
  { category: NearbyPlace["category"]; emoji: string }
> = {
  park: { category: "nature", emoji: "🌳" },
  tourist_attraction: { category: "nature", emoji: "🏞️" },
  museum: { category: "community", emoji: "🏛️" },
  library: { category: "library", emoji: "📚" },
  cafe: { category: "cafe", emoji: "☕" },
  coffee_shop: { category: "cafe", emoji: "☕" },
  gym: { category: "sports", emoji: "💪" },
  sports_club: { category: "sports", emoji: "🏀" },
  stadium: { category: "sports", emoji: "🏟️" },
  community_center: { category: "community", emoji: "🏘️" },
  art_gallery: { category: "community", emoji: "🎨" },
  bookstore: { category: "library", emoji: "📚" },
};

// Tipos de lugares que buscamos (low-anxiety, real-world)
const SEARCH_TYPES = [
  "park",
  "library",
  "cafe",
  "museum",
  "gym",
  "art_gallery",
  "community_center",
];

function generateChallengeForCategory(
  category: NearbyPlace["category"]
): string {
  const challenges = {
    nature: "Take a photo of something you find beautiful. No people, just nature.",
    library: "Pick up a book you'd never normally read. Read one chapter.",
    cafe: "Order something new and sit without your phone for 20 minutes.",
    sports: "Do 10 minutes of any physical activity. Even just walking fast counts.",
    community: "Say hello to one stranger. A smile counts.",
  };
  return challenges[category];
}

// Calcular distancia entre dos coordenadas (Haversine formula)
function calculateDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
}

function formatWalkTime(km: number): string {
  // Promedio: 5 km/h caminando
  const minutes = Math.round((km / 5) * 60);
  return `${minutes} min walk`;
}

// Tipo de la respuesta del Place NearbySearch (solo lo que usamos)
interface GooglePlaceResult {
  place_id?: string;
  name?: string;
  vicinity?: string;
  rating?: number;
  opening_hours?: { open_now?: boolean };
  geometry?: { location?: { lat: number; lng: number } };
}

/**
 * 🗺️ Fetch REAL places from Google Places API
 */
async function fetchRealNearbyPlaces(
  lat: number,
  lng: number
): Promise<NearbyPlace[]> {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn("No Google Maps API key configured, using mock data");
    return [];
  }

  try {
    // Seleccionar 2 tipos aleatorios para variedad
    const shuffledTypes = [...SEARCH_TYPES].sort(() => Math.random() - 0.5);
    const selectedTypes = shuffledTypes.slice(0, 2);

    const allPlaces: NearbyPlace[] = [];

    for (const type of selectedTypes) {
      const url =
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
        `location=${lat},${lng}` +
        `&radius=1500` +
        `&type=${type}` +
        `&opennow=true` +
        `&rankby=prominence` +
        `&key=${GOOGLE_MAPS_API_KEY}`;

      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`Places API failed for type ${type}:`, response.status);
        continue;
      }

      const data = await response.json();

      if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
        console.warn(`Places API status for ${type}:`, data.status);
        continue;
      }

const results = (data.results || []) as GooglePlaceResult[];

      // Tomar el mejor lugar de este tipo (abierto y bien calificado)
      const bestPlace = results
        .filter((p) => p.opening_hours?.open_now !== false)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];

      if (bestPlace) {
        const mapping = PLACE_TYPE_MAPPING[type] || {
          category: "community" as const,
          emoji: "📍",
        };

        const distanceKm = calculateDistanceKm(
          lat,
          lng,
          bestPlace.geometry?.location?.lat ?? lat,
          bestPlace.geometry?.location?.lng ?? lng
        );

        allPlaces.push({
          id: bestPlace.place_id ?? `place_${type}`,
          name: bestPlace.name ?? "Nearby spot",
          category: mapping.category,
          emoji: mapping.emoji,
          distance: formatDistance(distanceKm),
          walkTime: formatWalkTime(distanceKm),
          description: `${bestPlace.vicinity ?? ""}. ${
            bestPlace.rating ? `${bestPlace.rating}⭐ on Google Maps.` : ""
          }`,
          challenge: generateChallengeForCategory(mapping.category),
          googlePlaceId: bestPlace.place_id,
          address: bestPlace.vicinity,
          rating: bestPlace.rating,
          openNow: bestPlace.opening_hours?.open_now ?? true,
          mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            bestPlace.name ?? ""
          )}&query_place_id=${bestPlace.place_id ?? ""}`,
        });
      }
    }

    return allPlaces;
  } catch (error) {
    console.error("Error fetching places:", error);
    return [];
  }
}

/**
 * 🎲 Fallback mock data (when API fails or no key)
 */
function generateMockPlaces(): NearbyPlace[] {
  return [
    {
      id: "mock_1",
      name: "Central Park - South Entrance",
      category: "nature",
      emoji: "🌳",
      distance: "500m",
      walkTime: "7 min walk",
      description: "A quiet trail with benches. Perfect for clearing your head.",
      challenge: generateChallengeForCategory("nature"),
    },
    {
      id: "mock_2",
      name: "Brooklyn Public Library",
      category: "library",
      emoji: "📚",
      distance: "750m",
      walkTime: "10 min walk",
      description: "Huge, quiet, free. Grab a book, find a corner.",
      challenge: generateChallengeForCategory("library"),
    },
  ];
}

// Medals interface
interface Medal {
  id: string;
  title: string;
  emoji: string;
  earnedAt: number;
  placeName: string;
  placeUrl?: string;
}

export function useDisconnectMode() {
  const [isActive, setIsActive] = useState(false);
  const [result, setResult] = useState<DisconnectResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [medals, setMedals] = useState<Medal[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as Medal[]) : [];
    } catch {
      return [];
    }
  });
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Get location on mount (medals load eagerly in the useState initializer)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        () => {
          console.warn("Geolocation denied, using default (NYC)");
          setUserLocation({ lat: 40.7128, lng: -74.006 });
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  const activate = useCallback(async () => {
    setIsLoading(true);

    // Esperar ubicación si aún no la tenemos
    let location = userLocation;
    if (!location && navigator.geolocation) {
      try {
        const pos = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
            });
          }
        );
        location = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserLocation(location);
      } catch {
        location = { lat: 40.7128, lng: -74.006 };
      }
    }

    // Gemma insight (simulated - would come from backend in production)
    const gemmaInsights = [
      "Gemma detected elevated screen time pattern. Suggesting immediate environmental change.",
      "Your mood has shifted. Change your physical space to shift your mental space.",
      "Pattern detected: 3+ hours continuous screen. A walk resets dopamine levels in 20 minutes.",
      "Gemma insight: Physical movement is the fastest way to reset your nervous system.",
    ];

    // 🗺️ Fetch REAL places from Google
    let places: NearbyPlace[] = [];
    let usingRealData = false;

    if (location) {
      places = await fetchRealNearbyPlaces(location.lat, location.lng);
      usingRealData = places.length >= 2;
    }

    // Fallback to mock if API failed or returned too few
    if (places.length < 2) {
      console.warn("Using mock places as fallback");
      places = generateMockPlaces();
      usingRealData = false;
    }

    // Simular procesamiento de Gemma
    await new Promise((resolve) => setTimeout(resolve, 600));

    const newResult: DisconnectResult = {
      activated: true,
      nearbyPlaces: places.slice(0, 3),
      challengeTitle: "🌍 Disconnect Mission",
      challengeDescription:
        "Pick one place. Walk there. Complete the micro-challenge. Come back and claim your medal.",
      gemmaInsight:
        gemmaInsights[Math.floor(Math.random() * gemmaInsights.length)],
      usingRealData,
    };

    setResult(newResult);
    setIsActive(true);
    setIsLoading(false);
  }, [userLocation]);

  const claimMedal = useCallback(
    (place: NearbyPlace) => {
      const newMedal: Medal = {
        id: `medal_${Date.now()}`,
        title: `Disconnected at ${place.name}`,
        emoji: "🏅",
        earnedAt: Date.now(),
        placeName: place.name,
        placeUrl: place.mapsUrl,
      };

      setMedals((prev) => {
        const updated = [newMedal, ...prev];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      return newMedal;
    },
    []
  );

  const deactivate = useCallback(() => {
    setIsActive(false);
    setResult(null);
  }, []);

  return {
    isActive,
    isLoading,
    result,
    medals,
    activate,
    deactivate,
    claimMedal,
  };
}