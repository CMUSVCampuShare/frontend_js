import React, { useState } from "react";
import "../css/popup.css";

function Popup() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`popup ${isOpen ? "open" : ""}`}>
      <div className="popup-content">
        <button className="close-button" onClick={() => setIsOpen(false)}>
          X
        </button>
        <div className="popup-header">
          <h3>Let's get some riders</h3>
        </div>
        <div className="popup-body">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            rows="4"
            placeholder="Enter your message"
          ></textarea>
          <label htmlFor="capacity">Capacity</label>
          <input type="number" id="capacity" placeholder="Enter capacity" />
        </div>
        <div className="popup-footer">
          <button className="popup-button">Yes, confirm</button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
