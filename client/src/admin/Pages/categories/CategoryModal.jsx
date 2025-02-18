import { useState } from "react";
import { createCategory } from "../../../apiManager/methods/categoryMethods";
import "./CategoryModal.css"

const CategoryModal = ({ isOpen, onClose, parentCategoryID = "" }) => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addSubcategory = () => {
    setSubcategories([...subcategories, { id: "", name: "" }]);
  };

  const updateSubcategory = (index, field, value) => {
    const updated = [...subcategories];
    updated[index][field] = value;
    setSubcategories(updated);
  };

  const handleSubmit = async () => {
    setError("");
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    const categoryData = {
      id,
      name,
      subcategories: subcategories.filter(sc => sc.name.trim() !== ""),
    };

    try {
      setLoading(true);
      await createCategory(categoryData, parentCategoryID);
      alert("Category created successfully!"); // Simple feedback
      onClose();
    } catch (error) {
      setError("Failed to create category.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    isOpen && (
      <div className="modal">
        <div className="modal-content">
          <h2>Add New Category</h2>

          {error && <p className="error">{error}</p>}

          <label>Category ID</label>
          <input type="text" value={id} onChange={(e) => setId(e.target.value)} placeholder="Enter category id" />

          <label>Category Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter category name" />

          <label>Subcategories (Optional)</label>
          {subcategories.map((sub, index) => (
            <div key={index} className="subcategory-input">
              <input
                type="text"
                value={sub.id}
                onChange={(e) => updateSubcategory(index, "id", e.target.value)}
                placeholder="Subcategory id"
              />
              <input
                type="text"
                value={sub.name}
                onChange={(e) => updateSubcategory(index, "name", e.target.value)}
                placeholder="Subcategory name"
              />
              <button onClick={() => setSubcategories(subcategories.filter((_, i) => i !== index))}>Remove</button>
            </div>
          ))}
          <button className="add-subcategory-btn" onClick={addSubcategory}>+ Add Subcategory</button>

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

export default CategoryModal;
