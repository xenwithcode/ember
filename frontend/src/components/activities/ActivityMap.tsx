"use client";

import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { useState } from "react";
import { MapPin } from "lucide-react";
import { Activity } from "@/data/activities";

interface ActivityMapProps {
  activities: Activity[];
  hoveredActivityId: string | null;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.006,
};

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export default function ActivityMap({ activities, hoveredActivityId }: ActivityMapProps) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  // Fallback sin API key: lista de actividades con coordenadas en vez del mapa
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="w-full h-full bg-cream-100 flex flex-col items-center justify-center p-6">
        <MapPin className="w-8 h-8 text-terracotta-500 mb-3" />
        <p className="font-serif font-semibold text-coffee-800 mb-2">
          {activities.length} activities near New York, NY
        </p>
        <p className="text-xs text-warm-light text-center mb-4">
          Add <code className="bg-cream-200 px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>{" "}
          to your <code className="bg-cream-200 px-1 rounded">.env.local</code> to enable the map
        </p>
        <div className="w-full max-w-sm space-y-2">
          {activities.slice(0, 5).map((activity) => (
            <div
              key={activity.id}
              className={`flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-cream-200 text-sm ${
                hoveredActivityId === activity.id ? "ring-2 ring-terracotta-500" : ""
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-terracotta-500 shrink-0" />
              <span className="text-coffee-800 truncate">{activity.title}</span>
              <span className="text-warm-light ml-auto text-xs shrink-0">
                {activity.locationName}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-cream-200 flex items-center justify-center">
        <p className="text-warm-gray">Loading map...</p>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={defaultCenter}
      zoom={12}
      onLoad={(map) => setMap(map)}
      options={{
        styles: mapStyles,
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      {activities.map((activity) => (
        <Marker
          key={activity.id}
          position={{ lat: activity.latitude, lng: activity.longitude }}
          onClick={() => setSelectedActivity(activity)}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: hoveredActivityId === activity.id ? 12 : 8,
            fillColor: hoveredActivityId === activity.id ? "#E28766" : "#D97757",
            fillOpacity: 1,
            strokeColor: "#FFFFFF",
            strokeWeight: 2,
          }}
        />
      ))}

      {selectedActivity && (
        <InfoWindow
          position={{
            lat: selectedActivity.latitude,
            lng: selectedActivity.longitude,
          }}
          onCloseClick={() => setSelectedActivity(null)}
        >
          <div className="p-2 max-w-[200px]">
            <h3 className="font-serif font-semibold text-sm mb-1">
              {selectedActivity.title}
            </h3>
            <p className="text-xs text-gray-600 mb-2">
              {selectedActivity.locationName}
            </p>
            <a
              href={`/activities/${selectedActivity.id}`}
              className="text-xs text-terracotta-600 hover:text-terracotta-700 font-medium"
            >
              View details →
            </a>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

// Custom map styles to match the warm theme
const mapStyles = [
  {
    featureType: "all",
    elementType: "geometry",
    stylers: [{ color: "#FDFBF7" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#E8D5C4" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#F5F1E8" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#F0E6D8" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#D4E8D4" }],
  },
];