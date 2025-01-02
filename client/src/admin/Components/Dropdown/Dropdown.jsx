import CustomSelect from './CustomSelect';
import "./Dropdown.css"

// Main Component
const CategorySelectionSection = ({
  categories,
  selectedCategory,
  selectedSubcategory,
  nestedSubcategory,
  handleCategoryChange,
  handleSubcategoryChange,
  handleNestedSubcategoryChange
}) => {
  // Get subcategories for selected category
  const subcategories = categories
    .find((category) => category.id === selectedCategory)
    ?.subcategories || [];

  // Get nested subcategories for selected subcategory
  const nestedSubcategories = categories
    .find((category) => category.id === selectedCategory)
    ?.subcategories.find(
      (subcategory) => subcategory.id === selectedSubcategory
    )
    ?.subcategories || [];

  return (
    <div className="category-section sm-row">
      <CustomSelect
        label="Category"
        value={selectedCategory}
        options={categories}
        onChange={handleCategoryChange}
        placeholder="Select Category"
      />

      {selectedCategory && (
        <CustomSelect
          label="Subcategory"
          value={selectedSubcategory}
          options={subcategories}
          onChange={handleSubcategoryChange}
          placeholder="Select Subcategory"
        />
      )}

      {selectedSubcategory && (
        <CustomSelect
          label="Sub subcategory"
          value={nestedSubcategory}
          options={nestedSubcategories}
          onChange={handleNestedSubcategoryChange}
          placeholder="Select Nested Subcategory"
        />
      )}
    </div>
  );
};

export default CategorySelectionSection;