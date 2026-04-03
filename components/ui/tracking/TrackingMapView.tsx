import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

import type { Coordinate, TrackingMapPoint } from "./types";

type TrackingMapViewProps = {
  center: Coordinate;
  points: TrackingMapPoint[];
  route?: Coordinate[];
  height?: number;
  focusCoordinate?: Coordinate | null;
};

const MAPPR_ACCESS_TOKEN =
  process.env.EXPO_PUBLIC_TOOKAN_MAP_KEY ??
  process.env.EXPO_PUBLIC_MAPPR_KEY ??
  "";

const MAPPR_STYLE =
  process.env.EXPO_PUBLIC_TOOKAN_MAP_STYLE ??
  process.env.EXPO_PUBLIC_MAPPR_STYLE ??
  "style-dark.json";

const buildMapHtml = ({
  center,
  points,
  route,
  accessToken,
  mapStyle,
  focusCoordinate,
}: {
  center: Coordinate;
  points: TrackingMapPoint[];
  route: Coordinate[];
  accessToken: string;
  mapStyle: string;
  focusCoordinate?: Coordinate | null;
}) => {
  const payload = JSON.stringify({
    center,
    points,
    route,
    accessToken,
    mapStyle,
    focusCoordinate,
  });

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://maps.flightmap.io/flightmapjs"></script>
    <link href="https://api.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.css" rel="stylesheet" />
    <style>
      html, body, #map {
        margin: 0;
        width: 100%;
        height: 100%;
        background: #eef4f6;
        overflow: hidden;
        font-family: Arial, sans-serif;
      }

      #map {
        position: absolute;
        inset: 0;
      }

      .map-overlay-error {
        position: absolute;
        left: 12px;
        right: 12px;
        bottom: 12px;
        background: rgba(15, 23, 42, 0.9);
        color: #ffffff;
        font-size: 12px;
        border-radius: 10px;
        padding: 10px 12px;
        z-index: 20;
        display: none;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <div id="mapError" class="map-overlay-error"></div>
    <script>
      (function () {
        const data = ${payload};
        const errorBox = document.getElementById("mapError");

        function showError(message) {
          if (!errorBox) return;
          errorBox.style.display = "block";
          errorBox.textContent = message;
        }

        if (!data.accessToken) {
          showError("Mappr token missing. Please set EXPO_PUBLIC_MAPPR_KEY.");
          return;
        }

        try {
          const initialCenter = data.focusCoordinate
            ? [data.focusCoordinate.longitude, data.focusCoordinate.latitude]
            : [data.center.longitude, data.center.latitude];

          const map = new flightmap.Map({
            container: "map",
            style: data.mapStyle,
            center: initialCenter,
            zoom: 13,
            accessToken: data.accessToken,
          });

          if (typeof flightmap.NavigationControl === "function") {
            map.addControl(new flightmap.NavigationControl(), "bottom-right");
          }

          if (map.scrollZoom && typeof map.scrollZoom.enable === "function") {
            map.scrollZoom.enable();
          }

          if (
            map.touchZoomRotate &&
            typeof map.touchZoomRotate.enable === "function"
          ) {
            map.touchZoomRotate.enable();
          }

          if (
            map.doubleClickZoom &&
            typeof map.doubleClickZoom.enable === "function"
          ) {
            map.doubleClickZoom.enable();
          }

          map.on("load", function () {
            const pointFeatures = data.points.map(function (point) {
              return {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [point.longitude, point.latitude],
                },
                properties: {
                  id: point.id,
                  kind: point.kind,
                  title: point.title || "",
                },
              };
            });

            map.addSource("tracking-points", {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: pointFeatures,
              },
            });

            map.addLayer({
              id: "tracking-point-circles",
              type: "circle",
              source: "tracking-points",
              paint: {
                "circle-radius": 8,
                "circle-stroke-width": 2,
                "circle-stroke-color": "#ffffff",
                "circle-color": [
                  "match",
                  ["get", "kind"],
                  "pickup",
                  "#F59E0B",
                  "dropoff",
                  "#0F4C5C",
                  "driver",
                  "#FBBF24",
                  "#94A3B8"
                ]
              }
            });

            map.addLayer({
              id: "tracking-point-labels",
              type: "symbol",
              source: "tracking-points",
              layout: {
                "text-field": ["get", "title"],
                "text-size": 11,
                "text-offset": [0, 1.4],
                "text-anchor": "top"
              },
              paint: {
                "text-color": "#0F172A",
                "text-halo-color": "#ffffff",
                "text-halo-width": 1
              }
            });

            if (Array.isArray(data.route) && data.route.length > 1) {
              map.addSource("tracking-route", {
                type: "geojson",
                data: {
                  type: "Feature",
                  geometry: {
                    type: "LineString",
                    coordinates: data.route.map(function (point) {
                      return [point.longitude, point.latitude];
                    }),
                  },
                },
              });

              map.addLayer({
                id: "tracking-route-line",
                type: "line",
                source: "tracking-route",
                paint: {
                  "line-color": "#0F4C5C",
                  "line-width": 4,
                  "line-opacity": 0.95,
                  "line-dasharray": [2, 2],
                },
              });
            }

            if (data.focusCoordinate) {
              map.flyTo({
                center: [
                  data.focusCoordinate.longitude,
                  data.focusCoordinate.latitude,
                ],
                zoom: 15,
                essential: true,
              });
            } else if (Array.isArray(data.points) && data.points.length > 0) {
              let minLat = data.points[0].latitude;
              let maxLat = data.points[0].latitude;
              let minLng = data.points[0].longitude;
              let maxLng = data.points[0].longitude;

              data.points.forEach(function (point) {
                if (point.latitude < minLat) minLat = point.latitude;
                if (point.latitude > maxLat) maxLat = point.latitude;
                if (point.longitude < minLng) minLng = point.longitude;
                if (point.longitude > maxLng) maxLng = point.longitude;
              });

              map.fitBounds(
                [
                  [minLng, minLat],
                  [maxLng, maxLat],
                ],
                { padding: 46, maxZoom: 15 },
              );
            }
          });

          map.on("error", function (event) {
            const message = (event && event.error && event.error.message) || "Failed to load Flightmap tiles.";
            showError(message);
          });
        } catch (error) {
          showError((error && error.message) || "Map initialization failed.");
        }
      })();
    </script>
  </body>
</html>`;
};

export default function TrackingMapView({
  center,
  points,
  route = [],
  height = 420,
  focusCoordinate = null,
}: TrackingMapViewProps) {
  const html = useMemo(
    () =>
      buildMapHtml({
        center,
        points,
        route,
        accessToken: MAPPR_ACCESS_TOKEN,
        mapStyle: MAPPR_STYLE,
        focusCoordinate,
      }),
    [center, points, route, focusCoordinate],
  );

  return (
    <View style={[styles.container, { height }]}>
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        style={styles.webView}
        scrollEnabled={false}
        bounces={false}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: 28,
    backgroundColor: "#EEF4F6",
  },
  webView: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
