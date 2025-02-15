import React, { useState, useEffect } from 'react';
import { getCategory, updateCategorySizeGuide } from './path/to/your/api/file';
import { useNavigate } from 'react-router-dom';

const SizeGuideEditor = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sizeGuide, setSizeGuide] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch all categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategory();
        setCategories(response.data);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

  // Handle category selection
  const handleCategorySelect = async (categoryId) => {
    setIsLoading(true);
    try {
      const response = await getCategory(categoryId);
      setSizeGuide(response.data.size_guide || []);
      setSelectedCategory(categoryId);
    } catch (error) {
      console.error('Error loading size guide:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle size guide updates
  const handleSizeGuideUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateCategorySizeGuide(selectedCategory, { size_guide: sizeGuide });
      alert('Size guide updated successfully!');
      navigate('/categories'); // Or wherever you want to redirect
    } catch (error) {
      console.error('Error updating size guide:', error);
      alert('Failed to update size guide');
    }
  };

  // Add new size entry
  const addSizeEntry = () => {
    setSizeGuide([...sizeGuide, { Size: '', Chest: '', Waist: '', Hip: '', 'Arm Length': '' }]);
  };

  // Remove size entry
  const removeSizeEntry = (index) => {
    const newGuide = sizeGuide.filter((_, i) => i !== index);
    setSizeGuide(newGuide);
  };

  // Update field value
  const handleFieldChange = (index, field, value) => {
    const newGuide = [...sizeGuide];
    newGuide[index][field] = value;
    setSizeGuide(newGuide);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Size Guide</h1>
      
      <div className="mb-6">
        <label className="block mb-2">Select Category:</label>
        <select 
          className="p-2 border rounded"
          onChange={(e) => handleCategorySelect(e.target.value)}
          value={selectedCategory}
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p>Loading size guide...</p>
      ) : selectedCategory && (
        <form onSubmit={handleSizeGuideUpdate}>
          <div className="mb-4">
            <button
              type="button"
              onClick={addSizeEntry}
              className="bg-blue-500 text-white px-4 py-2 rounded mb-2"
            >
              Add Size Entry
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="border p-2">Size</th>
                  <th className="border p-2">Chest (in)</th>
                  <th className="border p-2">Waist (in)</th>
                  <th className="border p-2">Hip (in)</th>
                  <th className="border p-2">Arm Length (in)</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sizeGuide.map((entry, index) => (
                  <tr key={index}>
                    <td className="border p-2">
                      <input
                        type="text"
                        required
                        className="w-full p-1"
                        value={entry.Size}
                        onChange={(e) => handleFieldChange(index, 'Size', e.target.value)}
                      />
                    </td>
                    {['Chest', 'Waist', 'Hip', 'Arm Length'].map((field) => (
                      <td className="border p-2" key={field}>
                        <input
                          type="number"
                          step="0.1"
                          className="w-full p-1"
                          value={entry[field] || ''}
                          onChange={(e) => handleFieldChange(index, field, e.target.value)}
                        />
                      </td>
                    ))}
                    <td className="border p-2">
                      <button
                        type="button"
                        onClick={() => removeSizeEntry(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded mt-4"
          >
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
};

export default SizeGuideEditor;