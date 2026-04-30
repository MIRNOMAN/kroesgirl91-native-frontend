import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

const FLIGHTMAP_ACCESS_TOKEN = "720e4560-1db5-11f1-a301-ede322482ab2";

const FlightMapGradientComponent = () => {
  const mapHtml = `<!DOCTYPE html>
        <html>
          <head>
              <meta charset="utf-8" />
              <title>Create a draggable Marker</title>
              <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
              <script src="https://maps.flightmap.io/flightmapjs"></script>
              <link href="https://app.flightmap.io/v2/assets/css/flightmap.scss" rel="stylesheet" />
              <style>
                body { margin: 0; padding: 0; }
                #map { position: absolute; top: 0; bottom: 0; width: 100%; };
              </style>
          </head>
          <body>
              <style>
                .coordinates {
                background: rgba(0, 0, 0, 0.5);
                color: #fff;
                position: absolute;
                bottom: 40px;
                left: 10px;
                padding: 5px 10px;
                margin: 0;
                font-size: 11px;
                line-height: 18px;
                border-radius: 3px;
                display: none;
                }
              </style>
              <div id="map"></div>
              <pre id="coordinates" class="coordinates"></pre>
              <script>
                var coordinates = document.getElementById('coordinates');
                var map = new flightmap.Map({
                  container: 'map',
                  style: 'style-dark.json', //hosted style id
                  center: [-77.38, 39],
                  zoom: 2,
                  accessToken: '${FLIGHTMAP_ACCESS_TOKEN}'
                });

                var marker = new flightmap.Marker()
                  .setLngLat([0, 0])
                  .addTo(map);

                map.on('click', (event) => {
                  const { lng, lat } = event.lngLat
                  marker.setLngLat({ lng, lat });
                });
              </script>
          </body>
        </html>`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapWrapper}>
        <WebView
          originWhitelist={["*"]}
          source={{ html: mapHtml }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scrollEnabled={false} // Prevents the WebView itself from scrolling
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  mapWrapper: {
    flex: 1,
    overflow: "hidden", // Clips any boundary bleed
  },
});

export default FlightMapGradientComponent;
