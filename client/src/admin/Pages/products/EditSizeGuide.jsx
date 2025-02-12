import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const EditSizeGuide = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sizeGuide, setSizeGuide] = useState({ title: "", sizes: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSizeGuide = async () => {
      try {
        const response = await api.get(`/size-guides/${id}`);
        setSizeGuide(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch size guide");
        setLoading(false);
      }
    };

    if (id) {
      fetchSizeGuide();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSizeGuide((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSizes = [...sizeGuide.sizes];
    updatedSizes[index] = { ...updatedSizes[index], [name]: value };
    setSizeGuide((prev) => ({ ...prev, sizes: updatedSizes }));
  };

  const addSize = () => {
    setSizeGuide((prev) => ({ ...prev, sizes: [...prev.sizes, { label: "", measurement: "" }] }));
  };

  const removeSize = (index) => {
    setSizeGuide((prev) => ({ ...prev, sizes: prev.sizes.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/size-guides/${id}`, sizeGuide);
      } else {
        await api.post("/size-guides", sizeGuide);
      }
      navigate("/size-guides");
    } catch (err) {
      setError("Failed to save size guide");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>{id ? "Edit Size Guide" : "Add Size Guide"}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" name="title" value={sizeGuide.title} onChange={handleInputChange} required />
        </label>
        <div>
          <h3>Sizes</h3>
          {sizeGuide.sizes.map((size, index) => (
            <div key={index}>
              <input
                type="text"
                name="label"
                placeholder="Size Label"
                value={size.label}
                onChange={(e) => handleSizeChange(index, e)}
                required
              />
              <input
                type="text"
                name="measurement"
                placeholder="Measurement"
                value={size.measurement}
                onChange={(e) => handleSizeChange(index, e)}
                required
              />
              <button type="button" onClick={() => removeSize(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addSize}>Add Size</button>
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditSizeGuide;
