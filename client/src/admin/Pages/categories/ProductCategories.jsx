import { useState, useEffect } from "react";
import { getCategory, updateCategorySizeGuide, deleteCategory } from "../../../apiManager/methods/categoryMethods";
import "./ProductCategories.css";

const ProductCategories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sizeGuide, setSizeGuide] = useState([]);



  const handleEdit = (category) => {
    setSelectedCategory(category);
    setSizeGuide(category.sizeGuide || []);
    setShowModal(true);
  };

  const handleSave = () => {
    updateCategorySizeGuide(selectedCategory.id, { size_guide: sizeGuide })
      .then(() => {
        setShowModal(false);
        getCategory().then(data => setCategories(data));
      });
  };

  const handleDelete = (categoryID) => {
    deleteCategory(categoryID).then(() => {
      setCategories(categories.filter(cat => cat.id !== categoryID));
    });
  };

  useEffect(() => {
    getCategory().then((data) => {
        setCategories(data);
    }).catch((error) => {
        console.error("Error fetching categories:", error);
    });
}, []);

  return (
    <div className="categories-container">
      <h2>Product Categories</h2>
      <table>
        <thead>
          <tr>
            <th>Subcategory</th>
            <th>Size Guide</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => category.subcategories?.map(sub => (
            <tr key={sub.id}>
              <td>{sub.name}</td>
              <td>{JSON.stringify(sub.sizeGuide)}</td>
              <td>
                <button onClick={() => handleEdit(sub)}>Edit</button>
                <button onClick={() => handleDelete(sub.id)}>Delete</button>
              </td>
            </tr>
          )))}
        </tbody>
      </table>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Size Guide</h3>
            <textarea
              value={JSON.stringify(sizeGuide, null, 2)}
              onChange={(e) => setSizeGuide(JSON.parse(e.target.value))}
            />
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCategories;