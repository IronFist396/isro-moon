import React, { useState } from "react";
import Sidebar from "./components/sidebar";
import TilesOverlay from "./components/2d/Tiles_overlay";
import MoonLayer from "./components/3d/moonlayer";
import LandingPage from "./components/LandingPage";
import "./App.css";

const App = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [viewMode, setViewMode] = useState("3D"); // Default view mode
  const [selectedElement, setSelectedElement] = useState(null); // Single element selection
  const [overlay, setOverlay] = useState("moon");

  // Update overlay whenever the selected element changes
  const updateOverlay = (element) => {
    setOverlay(element ? `overlay_${element}` : "moon");
  };

  const handleElementChange = (value) => {
    setSelectedElement(value);
    updateOverlay(value);
  };

  if (showLanding) {
    return <LandingPage onEnterApp={() => setShowLanding(false)} />;
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Back Button */}
      <button 
        className="back-button"
        onClick={() => setShowLanding(true)}
        title="Back to Landing Page"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
      
      {/* Sidebar */}
      <Sidebar
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedElement={selectedElement}
        setSelectedElement={handleElementChange} // Updated handler
      />

      {/* Main Content Area */}
      <div style={{ flex: 1 }}>
        {viewMode === "2D" ? (
          <TilesOverlay
            key="2D" // Force re-render when toggling views
            selectedElement={selectedElement}
            overlay={overlay}
          />
        ) : (
          <MoonLayer
            key="3D" // Force re-render when toggling views
            viewMode={viewMode}
            selectedElement={selectedElement}
            overlay={overlay}
          />
        )}
      </div>
    </div>
  );
};

export default App;
