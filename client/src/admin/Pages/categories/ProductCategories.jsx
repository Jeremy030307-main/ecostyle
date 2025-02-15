import { useState, useEffect } from "react";
import { assets as assets_1 } from "../../Components/Assets/assets";
import { getCategory, updateCategorySizeGuide, deleteCategory } from "../../../apiManager/methods/categoryMethods";
import CategoryModal from "./CategoryModal";
import "./ProductCategories.css";

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [editedSizeGuide, setEditedSizeGuide] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await getCategory();
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Enable editing of a subcategory's size guide
  const handleEdit = (subcategory) => {
    setEditingSubcategory(subcategory);
    setEditedSizeGuide(
      subcategory.size_guide.reduce((acc, item, index) => {
        acc[index] = { ...item }; // Copy size guide
        return acc;
      }, {})
    );
  };

  // Update state when the user edits a value
  const handleSizeGuideChange = (index, key, value) => {
    setEditedSizeGuide((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [key]: value,
      },
    }));
  };

  // Save changes to the backend
  const handleSave = async () => {
    if (editingSubcategory) {
      const updatedSizeGuide = Object.values(editedSizeGuide);
      try {
        await updateCategorySizeGuide(editingSubcategory.id, { size_guide: updatedSizeGuide });

        // Update local state to reflect changes
        setCategories((prevCategories) =>
          prevCategories.map((category) => ({
            ...category,
            subcategories: category.subcategories.map((sub) =>
              sub.id === editingSubcategory.id ? { ...sub, size_guide: updatedSizeGuide } : sub
            ),
          }))
        );

        alert("Size Guide Updated Successfully!");
        setEditingSubcategory(null);
        setEditedSizeGuide({});
      } catch (error) {
        console.error("Error updating size guide:", error);
      }
    }
  };

  // Delete a subcategory and update backend
  const handleDelete = async (categoryID, subcategoryID) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      try {
        await deleteCategory(categoryID, subcategoryID);
        setCategories((prevCategories) =>
          prevCategories.map((cat) => ({
            ...cat,
            subcategories: cat.subcategories.filter((sub) => sub.id !== subcategoryID),
          }))
        );
      } catch (error) {
        console.error("Error deleting subcategory:", error);
      }
    }
  };

  // Extract unique measurement keys dynamically
  const getMeasurementKeys = () => {
    const allKeys = new Set();
    categories.forEach((cat) => {
      cat.subcategories.forEach((sub) => {
        if (sub.size_guide) {
          sub.size_guide.forEach((size) => {
            Object.keys(size).forEach((key) => allKeys.add(key));
          });
        }
      });
    });
    return Array.from(allKeys);
  };

  const measurementKeys = getMeasurementKeys();

  return (
    <div>
      <div className="add-categories-button-container">
        <h2>Product Categories</h2>
        <div onClick={() => setModalOpen(true)} className="add-categories-button">
          <img src={assets_1.add_icon} alt="" />
          <p className="button-word">Add A Category</p>
        </div>
        <CategoryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </div>

      <table>
        <thead>
          <tr>
            <th>Subcategory</th>
            {measurementKeys.map((key) => (
              <th key={key}>{key.replace("_", " ")}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) =>
            category.subcategories.map((sub) =>
              sub.size_guide ? (
                sub.size_guide.map((item, index) => (
                  <tr key={`${sub.id}-${index}`}>
                    <td>{sub.id}</td>
                    {measurementKeys.map((key) => (
                      <td key={key}>
                        {editingSubcategory?.id === sub.id ? (
                          <input
                            type="text"
                            value={editedSizeGuide[index]?.[key] || ""}
                            onChange={(e) => handleSizeGuideChange(index, key, e.target.value)}
                          />
                        ) : (
                          item[key] || "—"
                        )}
                      </td>
                    ))}
                    <td>
                      {editingSubcategory?.id === sub.id ? (
                        <>
                          <button onClick={handleSave}>💾 Save</button>
                          <button onClick={() => setEditingSubcategory(null)}>❌ Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(sub)}>✏️ Edit</button>
                          <button onClick={() => handleDelete(category.id, sub.id)}>🗑️ Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : null
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
