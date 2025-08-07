import React, { useState, useRef, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import "./moonlayer.css";
import Papa from "papaparse";

const MoonModel = React.forwardRef(
  ({ scale, overlayUrl, visible, overlayOpacity, imageUrl }, ref) => {
    const { scene } = useGLTF("Moon_1_3474.glb"); // Load the Moon model
    const [overlayTexture, setOverlayTexture] = useState(null);
    const [imageTexture, setImageTexture] = useState(null);
    const overlayMesh = useRef();

    // Load overlay texture
    useEffect(() => {
      if (overlayUrl) {
        const loader = new THREE.TextureLoader();
        loader.load(overlayUrl, (loadedTexture) => {
          setOverlayTexture(loadedTexture);
          if (overlayMesh.current) {
            overlayMesh.current.rotation.set(0, Math.PI, 0);
          }
        });
      } else {
        setOverlayTexture(null); // Clear overlay texture if URL is empty
      }

      return () => {
        if (overlayTexture) overlayTexture.dispose();
      };
    }, [overlayUrl]);

    // Load dynamic image texture
    useEffect(() => {
      if (imageUrl) {
        const loader = new THREE.TextureLoader();
        loader.load(imageUrl, (loadedTexture) =>
          setImageTexture(loadedTexture)
        );
      } else {
        setImageTexture(null); // Clear image texture if URL is empty
      }

      return () => {
        if (imageTexture) imageTexture.dispose();
      };
    }, [imageUrl]);

    if (overlayOpacity === 1) {
      return (
        <>
          {overlayTexture && (
            <mesh
              ref={overlayMesh}
              scale={[scale[0] * 504.5, scale[1] * 504.5, scale[2] * 504.5]}
              rotation={[0, Math.PI, 0]}
            >
              <sphereGeometry args={[1, 64, 64]} />
              <meshStandardMaterial
                map={overlayTexture}
                transparent={false}
                opacity={1} // Fully opaque overlay
                depthWrite={false}
                blending={THREE.NormalBlending}
              />
            </mesh>
          )}

          {/* Image Sphere */}
          {imageTexture && (
            <mesh
              scale={[scale[0] * 504.5, scale[1] * 504.5, scale[2] * 504.5]}
            >
              <sphereGeometry args={[1, 64, 64]} />
              <meshBasicMaterial map={imageTexture} />
            </mesh>
          )}
        </>
      );
    }

    return (
      <>
        {visible && overlayTexture && (
          <mesh
            ref={overlayMesh}
            scale={[scale[0] * 504.5, scale[1] * 504.5, scale[2] * 504.5]}
            rotation={[0, Math.PI, 0]}
          >
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial
              map={overlayTexture}
              transparent={true}
              opacity={overlayOpacity}
              depthWrite={false}
              blending={THREE.NormalBlending}
            />
          </mesh>
        )}
        {/* Image Sphere */}
        {imageTexture && (
          <mesh scale={[scale[0] * 504.5, scale[1] * 504.5, scale[2] * 504.5]}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshBasicMaterial>
              <texture attach="map" url={imageUrl} />
            </meshBasicMaterial>
          </mesh>
        )}
        {/* Moon Base Model */}
        {visible || <primitive ref={ref} object={scene} scale={scale} />}
      </>
    );
  }
);

const RaycasterHandler = ({ setCoordinates }) => {
  const { camera, mouse } = useThree();
  const moonRef = useRef();
  const raycaster = useRef(new THREE.Raycaster());

  useFrame(() => {
    if (moonRef.current) {
      raycaster.current.setFromCamera(mouse, camera);
      const intersects = raycaster.current.intersectObject(
        moonRef.current,
        true
      );
      if (intersects.length > 0) {
        const point = intersects[0].point;
        const sphereCoords = new THREE.Spherical();
        sphereCoords.setFromVector3(point);
        const latitude = (90 - (sphereCoords.phi * 180) / Math.PI).toFixed(3);
        let longitude = (90 + (sphereCoords.theta * 180) / Math.PI).toFixed(3);

        if (longitude > 180) longitude -= 360;
        else if (longitude < -180) longitude += 360;
        setCoordinates({ latitude, longitude });
      } else {
        setCoordinates({ latitude: 0, longitude: 0 });
      }
    }
  });

  return <MoonModel ref={moonRef} scale={[0.5, 0.5, 0.5]} />;
};

const locationList = [
  { name: "Birkhoff", latitude: 56.98412698, longitude: -162.7863464 },
  { name: "Debye", latitude: 45.55555556, longitude: -166.0328698 },
  { name: "Jackson", latitude: 19.52380952, longitude: -164.8967552 },
  { name: "Korolev", latitude: -9.047619048, longitude: -159.6325327 },
  { name: "Klute", latitude: 1.111111111, longitude: -132.8175306 },
  { name: "Lorentz", latitude: 37.93650794, longitude: -94.07332491 },
  { name: "Grimaldi", latitude: -5.238095238, longitude: -67.54150864 },
  { name: "Mare Orientale", latitude: -19.84126984, longitude: -95.33586178 },
  {
    name: "Oceanus Procellarum",
    latitude: 16.34920635,
    longitude: -56.59502739,
  },
  { name: "Chandrayaan 1 site", latitude: -89.54, longitude: 0 },
  { name: "Chandrayaan 3 landing site", latitude: -70.9, longitude: 22.9 },
  { name: "Mare Humorum", latitude: -26.82539683, longitude: -47.90391909 },
  { name: "Schickardi", latitude: -43.01587302, longitude: -55.31731985 },
  {
    name: "Chang'e 5 landing site",
    latitude: 41.42857143,
    longitude: -63.78929625,
  },
  {
    name: "Apollo 15 landing site",
    latitude: 24.92063492,
    longitude: 3.98145807,
  },
  {
    name: "Apollo 12 landing site",
    latitude: -3.968253968,
    longitude: -23.25158028,
  },
  {
    name: "Apollo 4 landing site",
    latitude: -3.968253968,
    longitude: -17.19848293,
  },
  { name: "Mare Nubium", latitude: -20.47619048, longitude: -15.0560472 },
  { name: "Mare Frigoris", latitude: 57.93650794, longitude: -13.68394437 },
  { name: "Mare Imbrium", latitude: 37.3015873, longitude: -20.80235988 },
  { name: "Mare Serenitatis", latitude: 30.95238095, longitude: 20.89844079 },
  {
    name: "Apollo 17 landing site",
    latitude: 19.84126984,
    longitude: 31.03413401,
  },
  {
    name: "Apollo 16 landing site",
    latitude: -9.047619048,
    longitude: 15.58870628,
  },
  { name: "Luna 24", latitude: 12.22222222, longitude: 62.85208597 },
  { name: "Luna 20", latitude: 3.968253968, longitude: 56.43657817 },
  { name: "Luna 16", latitude: -1.428571429, longitude: 56.08933839 },
  { name: "Mare Nectaris", latitude: -17.61904762, longitude: 36.56974294 },
  { name: "Bel'kovich", latitude: 59.52380952, longitude: 81.89970501 },
  { name: "Lacus Temporis", latitude: 44.28571429, longitude: 67.80109566 },
  { name: "Mare Marginis", latitude: 12.53968254, longitude: 87.70332912 },
  { name: "Mare Smythii", latitude: -1.428571429, longitude: 86.03624105 },
  { name: "Mare Australe", latitude: -48.41269841, longitude: 91.52128108 },
  { name: "Endymion", latitude: 54.44444444, longitude: 51.60724821 },
  { name: "Milikan", latitude: 44.28571429, longitude: 126.1019806 },
  { name: "Mare Moscoviense", latitude: 26.82539683, longitude: 147.9915718 },
  { name: "Sharonov", latitude: 10.0, longitude: 161.9199326 },
  { name: "Mare Tsiolkovskiy", latitude: -20.79365079, longitude: 130.2166035 },
  { name: "Mare Ingenii", latitude: -33.17460317, longitude: 162.6464391 },
];

const MoonLayer = React.memo(({ viewMode, selectedElement }) => {
  const [coordinates, setCoordinates] = useState({
    latitude: 0,
    longitude: 90,
  });
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const [value, setValue] = useState(null); // State to hold the value for the location
  const [data, setData] = useState([]); // State to hold the dynamic JSON data
  const [nearestLocation, setNearestLocation] = useState(null); // State to hold the nearest location
  // Load JSON data dynamically based on selectedElement
  useEffect(() => {
    if (selectedElement === "null") {
      setValue(null);
      setCoordinates({ latitude: 0, longitude: 90 });
      setNearestLocation(null);
      setData([]);
    } else {
      const filePath = `./TilesHigh/generated/generated/${selectedElement}/${selectedElement}.csv`; // Dynamically generate file path
      fetch(filePath)
        .then((response) => response.text())
        .then((csvData) => {
          Papa.parse(csvData, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (result) => setData(result.data),
          });
        })
        .catch((err) => {
          console.error(`Error loading CSV data for ${selectedElement}:`, err);
          setData([]);
        });
    }
  }, [selectedElement]);

  const findNearestValue = (latitude, longitude) => {
    const getDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Earth radius in km
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in km
      return distance;
    };

    // Find the closest point by calculating distance to all coordinates
    let closest = {
      latitude: 0,
      longitude: 0,
      value: null,
      distance: Infinity,
    };

    for (let entry of data) {
      const dist = getDistance(
        latitude,
        longitude,
        entry.latitude,
        entry.longitude
      );
      if (dist < closest.distance) {
        closest = { ...entry, distance: dist };
      }
    }

    return closest.value;
  };

  useEffect(() => {
    // Update value when coordinates or data changes
    const result = findNearestValue(
      coordinates.latitude,
      coordinates.longitude
    );
    setValue(result);
    const result2 = findNearestPlace(
      coordinates.latitude,
      coordinates.longitude
    );
    setNearestLocation(result2.name);
  }, [coordinates, data]);

  const findNearestPlace = (latitude, longitude) => {
    const getDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Earth radius in km
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in km
      return distance;
    };
    
    let closest = {
      name: null,
      value: "No Data",
      distance: Infinity,
    };
    for (const entry of locationList) {
      const dist = getDistance(
        latitude,
        longitude,
        entry.latitude,
        entry.longitude
      );
      if (dist < 1000 && dist < closest.distance) {
        closest = { ...entry, distance: dist };
      }
    }
    return closest;
  };

  // Map for texture combinations
  const textureMap = {
    Al_Si: "./TilesHigh/generated/generated/Al_Si.png",
    Mg_Si: "./TilesHigh/generated/generated/Mg_Si.png",
    FeL_Si: "./TilesHigh/generated/generated/FeL_Si.png",
    "Mg#_Si": "./TilesHigh/generated/generated/Mg1_Si.png",
    CaKa_Si: "./TilesHigh/generated/generated/CaKa_Si.png",
    Mg_Al: "./TilesHigh/generated/generated/Mg_Al.png",
  };

  // Generate selected texture URL
  const selectedCombo = `${selectedElement}`;
  const textureUrl = textureMap[selectedCombo] || ""; // Default to empty string if no match
  if (selectedElement === "Mg#_Si") {
    selectedElement = "Mg1_Si";
  }

  // Dynamically generate image URL
  const imageUrl = `./TilesHigh/generated/generated/${selectedElement}/${selectedElement}.png`;

  const mousePosition = useRef({ x: 0, y: 0 });

  const handlePointerMove = (event) => {
    const rect = event.target.getBoundingClientRect();
    mousePosition.current = {
      x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
    };
  };

  useEffect(() => {
    setOverlayOpacity(0.5);
  }, [selectedElement]);

  return (
    <div style={{ position: "relative", height: "100vh", width: "100%" }}>
      {/* <div className="watermark-overlay" /> */}
      <Canvas
        camera={{
          position: [500, 500, 500],
          fov: 50,
          near: 1,
          far: 10000,
        }}
        onPointerMove={handlePointerMove}
      >
        <ambientLight intensity={1.8} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <RaycasterHandler setCoordinates={setCoordinates} />
        
        {/* Render Moon Model with texture */}
        <MoonModel
          scale={[0.5, 0.5, 0.5]}
          overlayUrl={textureUrl} // Pass texture URL for overlay
          visible={viewMode === "3D"}
          overlayOpacity={overlayOpacity} // Pass dynamic opacity value
        />
        <OrbitControls
          enableZoom={true}
          zoomSpeed={2.0}
          rotateSpeed={1.2}
          enablePan={true}
          minDistance={280}
          maxDistance={2000}
        />
      </Canvas>

      {/* Display Image */}
      {imageUrl && imageUrl !== "" && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 9999,
            maxWidth: "300px",
            maxHeight: "300px",
          }}
        >
          <img
            src={imageUrl}
            alt="Dynamic overlay"
            style={{ width: "400px", height: "100%" }}
            onError={(e) => {
              e.target.style.visibility = "hidden"; // Hide the image if it fails to load
            }}
            onLoad={(e) => {
              e.target.style.visibility = "visible"; // Ensure visibility if image loads successfully
            }}
          />
        </div>
      )}

      <p className="chandrayaan">⁠Based on data from ISRO’s Chandrayaan-2</p>
      {/* Top-Left - Nearest Landmark */}
      <div
        style={{
          position: "absolute",
          top: "25%",
          left: "25%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          color: "white",
          padding: "10px 15px",
          borderRadius: "8px",
          fontSize: "14px",
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        {nearestLocation ? `Landmark: ${nearestLocation}` : "No Landmark"}
      </div>

      {/* Top-Right - Value */}
      <div
        style={{
          position: "absolute",
          top: "25%",
          right: "25%",
          transform: "translate(50%, -50%)",
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          color: "white",
          padding: "10px 15px",
          borderRadius: "8px",
          fontSize: "14px",
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        {value !== null ? `Value: ${value}` : "No Data"}
      </div>

      {/* Bottom-Left - Latitude */}
      <div
        style={{
          position: "absolute",
          bottom: "25%",
          left: "25%",
          transform: "translate(-50%, 50%)",
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          color: "white",
          padding: "10px 15px",
          borderRadius: "8px",
          fontSize: "14px",
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        Lat: {Math.round(coordinates.latitude * 1000) / 1000}°
      </div>

      {/* Bottom-Right - Longitude */}
      <div
        style={{
          position: "absolute",
          bottom: "25%",
          right: "25%",
          transform: "translate(50%, 50%)",
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          color: "white",
          padding: "10px 15px",
          borderRadius: "8px",
          fontSize: "14px",
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        Lon: {Math.round(coordinates.longitude * 1000) / 1000}°
      </div>

      {/* Selected Element Display */}
      {selectedElement && selectedElement !== "null" && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "15px 25px",
            borderRadius: "10px",
            fontSize: "24px",
            fontWeight: "bold",
            zIndex: 1000,
            pointerEvents: "none",
          }}
        >
          {selectedElement}
        </div>
      )}

      {/* Opacity Control */}
      {textureUrl && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          <label htmlFor="opacity-slider">Opacity:</label>
          <input
            id="opacity-slider"
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={overlayOpacity}
            onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
          />
        </div>
      )}
    </div>
  );
});

export default MoonLayer;
