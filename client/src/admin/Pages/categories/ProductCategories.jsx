// ProductCategories.jsx
import React, { useState, useEffect } from 'react';
import { assets } from "../../Components/Assets/assets";
import { getCategory, updateCategorySizeGuide, deleteCategory } from '../../../apiManager/methods/categoryMethods';
import CategoryModal from './CategoryModal'
import './ProductCategories.css';

const ProductCategories = () => {
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedSubcategories, setExpandedSubcategories] = useState({});
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [editedSizeGuide, setEditedSizeGuide] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategory();
      setCategories(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const toggleSubcategory = (subcategoryId) => {
    setExpandedSubcategories(prev => ({
      ...prev,
      [subcategoryId]: !prev[subcategoryId]
    }));
  };

  const handleEdit = (subcategory) => {
    setEditingSubcategory(subcategory);
    setEditedSizeGuide(
      subcategory.size_guide.reduce((acc, item, index) => {
        acc[index] = { ...item };
        return acc;
      }, {})
    );
  };

  const handleSizeGuideChange = (index, key, value) => {
    setEditedSizeGuide((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (editingSubcategory) {
      const updatedSizeGuide = Object.values(editedSizeGuide);
      try {
        await updateCategorySizeGuide(editingSubcategory.id, { size_guide: updatedSizeGuide });

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

  const handleDelete = async (categoryID, subcategoryID) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      try {
        await deleteCategory(categoryID);

        setCategories((prevCategories) =>
          prevCategories
            .map((cat) => ({
              ...cat,
              subcategories: cat.subcategories.filter((sub) => sub.id !== subcategoryID),
            }))
            .filter((cat) => cat.subcategories.length > 0)
        );

        alert("Subcategory deleted successfully!");
      } catch (error) {
        console.error("Error deleting subcategory:", error);
      }
    }
  };

  return (
    <div className="aname_product_categories">
      <div className="aname_category_header">
        <h2>Product Categories</h2>
        <div onClick={() => setModalOpen(true)} className="add-categories-button">
          <img src={assets.add_icon} alt="" />
          <p className="button-word">Add A Category</p>
        </div>
        <CategoryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </div>

      <div className="aname_category_menu">
        {categories.map((category) => (
          <div key={category.id} className="aname_category_item">
            <button
              className="aname_category_button"
              onClick={() => toggleCategory(category.id)}
            >
              <span>{category.name}</span>
              <span className="aname_chevron">
                {expandedCategories[category.id] ? '▼' : '▶'}
              </span>
            </button>

            {expandedCategories[category.id] && category.subcategories && (
              <div className="aname_subcategory_list">
                {category.subcategories.map((subcategory) => (
                  <div key={subcategory.id} className="aname_subcategory_item">
                    <button
                      className="aname_subcategory_button"
                      onClick={() => toggleSubcategory(subcategory.id)}
                    >
                      <span className='aname_cat_name'>{subcategory.name}</span>
                      <span className="aname_chevron">
                        {expandedSubcategories[subcategory.id] ? '▼' : '▶'}
                      </span>
                    </button>

                    {expandedSubcategories[subcategory.id] && subcategory.size_guide && (
                      <div className="aname_size_guide_container">
                        <div className='aname_size_guide-edit-button'>
                          {editingSubcategory?.id === subcategory.id ? (
                            <>
                              <button
                                className="aname_save_btn"
                                onClick={handleSave}
                              >
                                💾 Save
                              </button>
                              <button
                                className="aname_cancel_btn"
                                onClick={() => {
                                  setEditingSubcategory(null);
                                  setEditedSizeGuide({});
                                }}
                              >
                                ❌ Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="aname_edit_btn"
                                onClick={() => handleEdit(subcategory)}
                              >
                                ✏️ Edit
                              </button>
                              {/* <button
                                        className="aname_delete_btn"
                                        onClick={() => handleDelete(category.id, subcategory.id)}
                                      >
                                        Delete
                                      </button> */}
                            </>
                          )}
                        </div>
                        <table className="aname_size_guide_table">
                          <thead>
                            <tr>
                              <th>Size</th>
                              {Object.keys(subcategory.size_guide[0])
                                .filter(key => key !== 'Size')
                                .map(key => (
                                  <th key={key}>{key.replace('_', ' ')}</th>
                                ))}
                            </tr>
                          </thead>
                          <tbody>
                            {subcategory.size_guide.map((item, index) => (
                              <tr key={index}>
                                <td>
                                  {editingSubcategory?.id === subcategory.id ? (
                                    <input
                                      type="text"
                                      className="aname_edit_input"
                                      value={editedSizeGuide[index]?.Size || ''}
                                      onChange={(e) => handleSizeGuideChange(index, 'Size', e.target.value)}
                                    />
                                  ) : (
                                    item.Size
                                  )}
                                </td>
                                {Object.keys(item)
                                  .filter(key => key !== 'Size')
                                  .map(key => (
                                    <td key={key}>
                                      {editingSubcategory?.id === subcategory.id ? (
                                        <input
                                          type="text"
                                          className="aname_edit_input"
                                          value={editedSizeGuide[index]?.[key] || ''}
                                          onChange={(e) => handleSizeGuideChange(index, key, e.target.value)}
                                        />
                                      ) : (
                                        item[key] || '—'
                                      )}
                                    </td>
                                  ))}

                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCategories;