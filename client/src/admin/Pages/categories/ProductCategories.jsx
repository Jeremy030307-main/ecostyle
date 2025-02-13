import { useState, useEffect } from "react";
import { getCategory, updateCategorySizeGuide, deleteCategory } from "../../../apiManager/methods/categoryMethods";
import "./ProductCategories.css";

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [sizeGuide, setSizeGuide] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await getCategory();
        console.log("All Categories Fetched", categories)
        setCategories(categoryData); // Example: [{id: 'MEN', name: 'Men', subcategories: [...]}, ...]
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  const handleEdit = (category) => {
    setEditingCategory(category);
    setSizeGuide(category.size_guide || []);
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingCategory) {
      updateCategorySizeGuide(editingCategory.id, { size_guide: sizeGuide })
        .then(() => {
          alert("Size Guide Updated Successfully!");
          setShowModal(false);
          window.location.reload();
        })
        .catch((error) => console.error("Error updating size guide:", error));
    }
  };

  const handleDelete = (categoryID) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteCategory(categoryID).then(() => {
        setCategories(categories.filter(cat => cat.id !== categoryID));
      }).catch((error) => console.error("Error deleting category:", error));
    }
  };

  const getMeasurementKeys = () => {
    const allKeys = new Set();
    categories.forEach(cat =>
      cat.subcategories.forEach(sub =>
        sub.size_guide.forEach(size =>
          Object.keys(size).forEach(key => allKeys.add(key))
        )
      )
    );
    return Array.from(allKeys);
  };

  const measurementKeys = getMeasurementKeys();

  return (
    <div>
      <h2>Product Categories</h2>
      <table>
        <thead>
          <tr>
            <th>Subcategory</th>
            {measurementKeys.map((key) => (
              <th key={key}>{key.replace("_", " ")}</th> // Formatting column names
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) =>
            category.subcategories.map((sub) =>
              sub.size_guide.map((item, index) => (
                <tr key={index}>
                  <td>{sub.id}</td>
                  {measurementKeys.map((key) => (
                    <td key={key}>{item[key] || "—"}</td> // Show dash if missing
                  ))}
                  <td>
                    <button onClick={() => handleEdit(category)}>✏️</button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(category.id)}>🗑️</button>
                  </td>
                </tr>
              ))
            )
          )}
        </tbody>
      </table>
      
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Size Guide</h3>
            <textarea
              value={JSON.stringify(sizeGuide, null, 2)}
              onChange={(e) => setSizeGuide(JSON.parse(e.target.value))}
              rows="5"
            />
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryTable;