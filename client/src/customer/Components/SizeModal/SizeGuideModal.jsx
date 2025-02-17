import React from "react";
import "./SizeGuideModal.css"; // Ensure styling

const SizeGuideModal = ({ isOpen, onClose, sizeGuide }) => {
  if (!isOpen) return null;

  return (
    <div className="size-guide-modal-overlay">
      <div className="size-guide-modal-window">
        <button className="close-btn" onClick={onClose}>✖</button>
        
        {/* Title Positioned Above Table */}
        <div className="size-guide-header">
          <h2>Size Guide</h2>
        </div>

        {sizeGuide && sizeGuide.length > 0 ? (
          <div className="size-guide-content-modal">
            <table className="size-guide-table">
              <thead>
                <tr>
                  <th>Size</th>
                  {Object.keys(sizeGuide[0])
                    .filter(key => key !== "Size")
                    .map((key) => (
                      <th key={key}>{key.replace("_", " ")}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {sizeGuide.map((item, index) => (
                  <tr key={index}>
                    <td>{item.Size}</td>
                    {Object.keys(item)
                      .filter(key => key !== "Size")
                      .map((key) => (
                        <td key={key}>{item[key] || "—"}</td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No size guide available.</p>
        )}
      </div>
    </div>
  );
};

export default SizeGuideModal;
