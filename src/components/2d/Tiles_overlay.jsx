import React, { useRef, useEffect, useState } from "react";
import "ol/ol.css";
import OLMap from "ol/Map";
import OView from "ol/View";
import TileLayer from "ol/layer/Tile";
import TileImage from "ol/source/TileImage";
import TileGrid from "ol/tilegrid/TileGrid";
import MousePosition from "ol/control/MousePosition";
import { defaults as defaultControls } from "ol/control";
import Zoom from "ol/control/Zoom";
import GroupLayer from "ol/layer/Group";
import Papa from "papaparse";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Style, Circle, Fill } from "ol/style";
import "./Tiles_overlay.css";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import Overlay from "ol/Overlay";

const Tiles_Overlay = ({ selectedElement }) => {
  const mapRef = useRef(null);
  const mousePositionControlRef = useRef(null);
  const overlayLayer1Ref = useRef(null);
  const markersRef = useRef(null); // Define the ref for the markers layer
  const overlayLayer2Ref = useRef(null);

  const [coordinates, setCoordinates] = useState({
    latitude: 0,
    longitude: 90,
  });
  const [sliderValue, setSliderValue] = useState(0.5);
  const [csvData, setCsvData] = useState([]);
  const [closestValue, setClosestValue] = useState("");
  const [markersVisible, setMarkersVisible] = useState(false); // State to manage marker visibility
  const [markerLayer, setMarkerLayer] = useState(null); // State to store marker layer

  if (selectedElement === "Mg#_Si") {
    selectedElement = "Mg1_Si";
  }
  useEffect(() => {
    if (selectedElement === null) {
      setCoordinates({ latitude: 0, longitude: 90 });
      setClosestValue(""); // Reset closest value
      setSliderValue(0.5); // Reset slider value
      setCsvData([]);
      if (overlayLayer1Ref.current) overlayLayer1Ref.current.setOpacity(0.5);
      if (overlayLayer2Ref.current) overlayLayer2Ref.current.setOpacity(0.5);
    } else {
      console.log("Fetching CSV for:", selectedElement);
      const filePath = `./TilesHigh/generated/generated/${selectedElement}/${selectedElement}.csv`;
      fetch(filePath)
        .then((response) => {
          if (!response.ok)
            throw new Error(`Failed to fetch CSV: ${response.status}`);
          return response.text();
        })
        .then((csvText) => {
          Papa.parse(csvText, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (result) => {
              setCsvData(result.data);
            },
          });
        })
        .catch((err) => {
          console.error("Error loading CSV:", err);
        });
    }
  }, [selectedElement]);

  useEffect(() => {
    // Log updated csvData whenever it changes
    console.log("csv data updated:", csvData);
  }, [csvData]);

  const csvDataRef = useRef([]);

  useEffect(() => {
    setSliderValue(0.5); // Reset slider value
    if (overlayLayer1Ref.current) overlayLayer1Ref.current.setOpacity(0.5);
    if (overlayLayer2Ref.current) overlayLayer2Ref.current.setOpacity(0.5);
  }, [selectedElement]);

  useEffect(() => {
    csvDataRef.current = csvData; // Update ref whenever csvData changes
  }, [csvData]);

  const findClosestValue = (lat, lon) => {
    if (!csvDataRef.current || csvDataRef.current.length === 0) return "";

    let closest = null;
    let minDistance = Infinity;

    for (let entry of csvDataRef.current) {
      if (
        entry &&
        typeof entry.latitude === "number" &&
        typeof entry.longitude === "number"
      ) {
        const distance = Math.sqrt(
          Math.pow(entry.latitude - lat, 2) + Math.pow(entry.longitude - lon, 2)
        );
        if (distance < minDistance) {
          minDistance = distance;
          closest = entry;
        }
      }
    }

    return closest ? closest.value : "";
  };

  useEffect(() => {
    if (!mapRef.current) {
      const mousePositionControl = new MousePosition({
        className: "custom-mouse-position",
        target: document.getElementById("mouse-position"),
        coordinateFormat: (coord) => {
          if (!coord) {
            setCoordinates({ lat: null, lon: null });
            setClosestValue("");
            return "";
          }
          
          const lat = (coord[1] - 90).toFixed(3);
          const lon = (coord[0] - 180).toFixed(3);
          const latMin = -90;
          const latMax = 90;
          const lonMin = -180;
          const lonMax = 180;

          const closest = findClosestValue(parseFloat(lat), parseFloat(lon));
          if (
            lat >= latMin &&
            lat <= latMax &&
            lon >= lonMin &&
            lon <= lonMax
          ) {
            setCoordinates({ lat, lon });
            setClosestValue(closest);
            return `Lat: ${lat}, Long: ${lon}, Value: ${closest ? parseFloat(closest).toFixed(5) : ""}`;
          } else {
            setCoordinates({ lat: null, lon: null });
            setClosestValue("");
            return "";
          }
        },
      });

      const zoomControl = new Zoom();

      const map = new OLMap({
        controls: defaultControls().extend([mousePositionControl, zoomControl]),
        target: "map",
        view: new OView({
          center: [180.0, 105.0],
          resolution: 0.3515625,
        }),
      });

      mapRef.current = map;
      mousePositionControlRef.current = mousePositionControl;
    }

    const overlayLayer1 = new TileLayer({
      title: "Dynamic Overlay",
      source: new TileImage({
        tileGrid: new TileGrid({
          extent: [0, 0, 360, 180],
          origin: [0, 0],
          resolutions: [
            1.40625, 0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125,
            0.02197265625, 0.010986328125, 0.0054931640625,
          ],
          tileSize: [256, 256],
        }),
        tileUrlFunction: (tileCoord) =>
          `./TilesHigh/generated/generated/${selectedElement}/{z}/{x}/{y}.png`
            .replace("{z}", String(tileCoord[0]))
            .replace("{x}", String(tileCoord[1]))
            .replace("{y}", String(-1 - tileCoord[2])),
      }),
      opacity: 0.5,
    });

    const overlayLayer2 = new TileLayer({
      title: "Moon Base",
      source: new TileImage({
        tileGrid: new TileGrid({
          extent: [0, 0, 360, 180],
          origin: [0, 0],
          resolutions: [
            1.40625, 0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125,
            0.02197265625, 0.010986328125, 0.0054931640625,
          ],
          tileSize: [256, 256],
        }),
        tileUrlFunction: (tileCoord) =>
          `./TilesHigh/base/base/{z}/{x}/{y}.png`
            .replace("{z}", String(tileCoord[0]))
            .replace("{x}", String(tileCoord[1]))
            .replace("{y}", String(-1 - tileCoord[2])),
      }),
      opacity: 0.5,
    });

    const layers = selectedElement
      ? [overlayLayer1, overlayLayer2]
      : [overlayLayer2];
    const layerGroup = new GroupLayer({
      title: "Base - Overlay Layers",
      layers,
    });

    const map = mapRef.current;
    map.getLayers().clear();
    map.addLayer(layerGroup);

    // Create an overlay for the tooltip
    const tooltip = new Overlay({
      element: document.createElement("div"),
      positioning: "bottom-center",
      offset: [0, -10], // Adjust positioning of the tooltip
      stopEvent: false, // Allow the mouse event to propagate
    });

    const tooltipElement = tooltip.getElement();
    tooltipElement.style.color = "yellow"; // Set text color to black
    tooltipElement.style.padding = "2px"; // Add some padding
    tooltipElement.style.fontSize = "12px"; // Optional: adjust font size
    tooltipElement.style.textAlign = "center"; // Optional: center the text

    // Add the tooltip overlay to the map
    map.addOverlay(tooltip);

    function loadCSVAndAddMarkers(csvFilePath) {
      fetch(csvFilePath)
        .then((response) => response.text())
        .then((data) => {
          // Parse CSV
          const rows = data.split("\n");
          const features = [];

          rows.forEach((row) => {
            const [long, lat, name] = row.split(","); // Assuming no header row
            if (long && lat) {
              const feature = new Feature({
                geometry: new Point([
                  parseFloat(long) + 180,
                  parseFloat(lat) + 90,
                ]),
                name: name.trim(),
              });

              // Add a red circle style
              feature.setStyle(
                new Style({
                  image: new Circle({
                    radius: 8, // Size of the circle
                    fill: new Fill({ color: "hsla(133, 94%, 35%,80%)" }), // Circle color
                  }),
                })
              );

              features.push(feature);
            }
          });

          // Add to vector source
          const vectorSource = new VectorSource({ features });
          const vectorLayer = new VectorLayer({ 
            source: vectorSource,
            visible: markersVisible // Set initial visibility based on current state
          });
          markersRef.current = vectorLayer; // Store the markers in the ref
          setMarkerLayer(vectorLayer); // Store the vectorLayer in state

          map.addLayer(vectorLayer);

          map.on("pointermove", function (evt) {
            const feature = map.forEachFeatureAtPixel(
              evt.pixel,
              (feature) => feature
            );
            if (feature) {
              tooltip.getElement().innerHTML = feature.get("name");
              tooltip.setPosition(evt.coordinate);
            } else {
              tooltip.getElement().innerHTML = "";
            }
          });
        })
        .catch((error) => console.error("Error loading CSV:", error));
    }

    loadCSVAndAddMarkers("/data.csv");

    // Store marker layer in the state once it’s created
    const vectorLayer = markersRef.current;
    setMarkerLayer(vectorLayer); // Store the marker layer in state

    // Add marker visibility handling in the map
    if (vectorLayer) {
      vectorLayer.setVisible(markersVisible); // Set initial visibility based on the state
    }

    overlayLayer1Ref.current = overlayLayer1;
    overlayLayer2Ref.current = overlayLayer2;

    return () => {
      map.getLayers().clear();
    };
  }, [selectedElement]);

  // Effect to handle marker visibility changes
  useEffect(() => {
    if (markersRef.current) {
      markersRef.current.setVisible(markersVisible);
    }
  }, [markersVisible]);

  const toggleMarkersVisibility = () => {
    setMarkersVisible(prev => !prev);
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div
        id="map"
        style={{ height: "100%", width: "100%", border: "1px solid #888" }}
      ></div>
      <div
        id="mouse-position"
        style={{
          padding: "5px",
          background: "#fff",
          border: "1px solid #888",
          position: "absolute",
          bottom: "10px",
          zIndex: 1000,
        }}
      ></div>

      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "200px",
          width: "85%",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "10px",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: selectedElement ? "space-around" : "space-between",
          zIndex: 1000,
        }}
      >
        {selectedElement ? (
          <img
            src={`./TilesHigh/generated/generated/${selectedElement}/${selectedElement}.png`}
            alt="Preview Moon surface"
            style={{
              width: "380px",
              height: "auto",
              marginBottom: "10px",
              display: "block",
              objectFit: "contain",
            }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <span></span>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "14px", color: "#666" }}>Opacity:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={sliderValue}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setSliderValue(value);
              if (selectedElement) {
                if (overlayLayer1Ref.current)
                  overlayLayer1Ref.current.setOpacity(value);
                if (overlayLayer2Ref.current)
                  overlayLayer2Ref.current.setOpacity(1 - value);
              } else {
                if (overlayLayer2Ref.current)
                  overlayLayer2Ref.current.setOpacity(value);
              }
            }}
            style={{ width: "150px" }}
          />
        </div>

        <button className="beauty" onClick={toggleMarkersVisibility}>
          {markersVisible ? "Hide" : "Show"} Landmarks
        </button>
      </div>
    </div>
  );
};

export default Tiles_Overlay;
