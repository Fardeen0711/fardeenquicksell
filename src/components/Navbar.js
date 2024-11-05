import React, { useState } from "react";
import "./Navbar.css";
import down from "../assets/down.svg";
import display from "../assets/Display.svg";

const Navbar = ({ onGroupingChange, onOrderingChange, currentGrouping, currentOrdering }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleGroupingChange = (e) => {
    onGroupingChange(e.target.value);
    setDropdownOpen(false);
  };

  const handleOrderingChange = (e) => {
    onOrderingChange(e.target.value);
    setDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <button
        onClick={() => setDropdownOpen(!isDropdownOpen)}
        className="dropdown-button"
      >
        <img className="display-icon" src={display} alt="" />
        Display
        <img className="down-icon" src={down} alt="" />
      </button>
      {isDropdownOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-item">
            <label>Grouping</label>
            <select value={currentGrouping} onChange={handleGroupingChange}>
              <option value="Status">Status</option>
              <option value="User">User</option>
              <option value="Priority">Priority</option>
            </select>
          </div>
          <div className="dropdown-item">
            <label>Ordering</label>
            <select value={currentOrdering} onChange={handleOrderingChange}>
              <option value="Priority">Priority</option>
              <option value="Title">Title</option>
            </select>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
