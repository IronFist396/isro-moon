import React from "react";
import "./sidebar.css";

const Sidebar = ({
  viewMode,
  setViewMode,
  selectedElement,
  setSelectedElement,
}) => {
 const elements = ["Al_Si", "Mg_Si", "Mg_Al", "CaKa_Si", "Mg#_Si", "FeL_Si"];
  return (
    <div className="sidebar">
      <h3>Settings</h3>
      <ul>
        {/* Toggle View Mode */}
        <li className="view-mode">
          <h4>View Mode</h4>
          <label>
            <input
              type="radio"
              name="viewMode"
              value="3D"
              checked={viewMode === "3D"}
              onChange={() => setViewMode("3D")}
            />
            3D
          </label>
          <label>
            <input
              type="radio"
              name="viewMode"
              value="2D"
              checked={viewMode === "2D"}
              onChange={() => setViewMode("2D")}
            />
            2D
          </label>
        </li>

        {/* Dropdown for Element Selection */}
        <li>
          <h4>Select Ratio Overlay</h4>
          <select
            value={selectedElement || ""}
            onChange={(e) => setSelectedElement(e.target.value || null)} // Ensure null value is set if "None" is selected
          >
            <option value="">None</option>
            {elements.map((element, index) => (
              <option key={index} value={element}>
                {element}
              </option>
            ))}
          </select>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
