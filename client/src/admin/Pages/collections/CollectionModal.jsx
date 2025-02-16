import { useState } from "react";
import { addCollection } from "../../../apiManager/methods/collectionMethods";
import "./CollectionModal.css"

const CollectionModal = ({ isOpen, onClose}) => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!name.trim()) {
      setError("collection name is required.");
      return;
    }

    try {
      setLoading(true);
      await addCollection(id, name, description);
      alert("collection created successfully!"); // Simple feedback
      onClose();
    } catch (error) {
      setError("Failed to create collection.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    isOpen && (
      <div className="modal">
        <div className="modal-content">
          <h2>Add New Collection</h2>

          {error && <p className="error">{error}</p>}

          <label>ID</label>
          <input type="text" value={id} onChange={(e) => setId(e.target.value)} placeholder="Ex: ER" />

          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Eo Roots" />

          <label>Description</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Sustainable and old money concepts" />

          <div className="modal-actions">
            <button onClick={onClose} className="cancel-btn">Cancel</button>
            <button onClick={handleSubmit} disabled={loading} className="save-btn">
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default CollectionModal;
