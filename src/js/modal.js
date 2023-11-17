import React, { useState } from "react";
import "../css/modal.css";

function CreatePostModal({ isOpen, onClose }) {
  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          X
        </button>
        <h2>Let's get some riders!</h2>
        <textarea placeholder="Message" rows="4"></textarea>
        <input type="number" placeholder="Capacity" min="1" />
        <button className="modal-confirm">Yes, confirm</button>
      </div>
    </div>
  );
}

export default CreatePostModal;
