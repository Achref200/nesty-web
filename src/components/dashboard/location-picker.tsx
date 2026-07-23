"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { isInTunisia } from "@/lib/listings/schema";
import { cn } from "@/lib/utils";

// Default centre: Tunis. Agencies pan/zoom and tap to drop the exact pin.
const TUNIS: [number, number] = [36.8065, 10.1815];

// A monochrome ink pin — avoids Leaflet's default (broken) marker asset.
const PIN = L.divIcon({
  className: "",
  html:
    '<div style="width:22px;height:22px;border-radius:50% 50% 50% 0;' +
    "background:#141414;transform:rotate(-45deg);border:2px solid #fff;" +
    'box-shadow:0 4px 10px rgba(0,0,0,.3)"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 22],
});

function ClickCapture({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * Interactive map that captures the property's exact latitude & longitude.
 * Controlled when `value`/`onChange` are provided (wizard); otherwise falls
 * back to internal state + hidden inputs for plain `<form>` usage.
 */
export function LocationPicker({
  value,
  onChange,
}: {
  value?: LatLng | null;
  onChange?: (pos: LatLng | null) => void;
} = {}) {
  const controlled = onChange !== undefined;
  const [internal, setInternal] = useState<[number, number] | null>(null);
  const pos: [number, number] | null = controlled
    ? value
      ? [value.lat, value.lng]
      : null
    : internal;
  const t = useTranslations("dashboard.location");

  function pick(lat: number, lng: number) {
    if (controlled) onChange?.({ lat, lng });
    else setInternal([lat, lng]);
  }

  const outside = pos ? !isInTunisia(pos[0], pos[1]) : false;

  return (
    <div>
      <div className="h-64 w-full overflow-hidden rounded-2xl border border-separator">
        <MapContainer
          center={pos ?? TUNIS}
          zoom={12}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickCapture onPick={pick} />
          {pos && <Marker position={pos} icon={PIN} />}
        </MapContainer>
      </div>
      {!controlled && (
        <>
          <input type="hidden" name="latitude" value={pos ? pos[0] : ""} />
          <input type="hidden" name="longitude" value={pos ? pos[1] : ""} />
        </>
      )}
      <p
        className={cn(
          "mt-2 text-[13px]",
          outside ? "text-danger" : "text-muted",
        )}
      >
        {outside
          ? t("outsideTunisia")
          : pos
            ? t("pinned", { lat: pos[0].toFixed(5), lng: pos[1].toFixed(5) })
            : t("tapToPin")}
      </p>
    </div>
  );
}
