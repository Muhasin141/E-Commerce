import React, { useState, useEffect } from "react";

// 💥 FIX 1: Changed 'initialFilters' to 'filters' to match ProductsPage.js
// 💥 FIX 2: Added 'productCategories' prop
const ProductFilters = ({
  filters: incomingFilters,
  onFilterChange,
  productCount,
  productCategories = [],
}) => {
  // Initialize local state with the incoming filters from the parent
  // We use 'incomingFilters' here to avoid a naming conflict with the state variable 'filters'
  const [filters, setFilters] = useState(incomingFilters);

  // 💥 FIX 3: Sync local state when incoming filters change (important for global search)
  useEffect(() => {
    setFilters(incomingFilters);
  }, [incomingFilters]);

  // Use useEffect to call the parent handler whenever local filters change
  useEffect(() => {
    // Only trigger parent update if the filters have actually changed
    // and after the initial mount (since incomingFilters handles the first sync)
    if (filters !== incomingFilters) {
      onFilterChange(filters);
    }
    // We intentionally exclude incomingFilters from the dependency array here
    // to avoid an infinite loop between parent and child on every re-render,
    // but we rely on the first useEffect (FIX 3) to handle external changes.
  }, [filters]);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      categories: checked
        ? [...prev.categories, value]
        : prev.categories.filter((c) => c !== value),
    }));
  };

  const handleRatingChange = (e) => {
    setFilters((prev) => ({ ...prev, rating: Number(e.target.value) }));
  };

  const handleSortChange = (e) => {
    setFilters((prev) => ({ ...prev, sortBy: e.target.value }));
  };

  const handleClear = () => {
    // Ensure the price range default matches the one in ProductsPage.js [0, 5000]
    setFilters({
      categories: [],
      rating: 0,
      sortBy: null,
      priceRange: [0, 5000],
      searchTerm: "",
    });
  };

  // 💥 FIX 4: Safety check for price range default values
  const maxPriceValue = filters.priceRange ? filters.priceRange[1] : 5000;

  return (
    <div className="card shadow-sm p-3 mb-4 sticky-top" style={{ top: "80px" }}>
      <h5 className="card-title mb-3">Filters</h5>

      <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
        <span>Showing {productCount} products</span>
        <button className="btn btn-sm btn-outline-danger" onClick={handleClear}>
          Clear All
        </button>
      </div>

      {/* --- Category Filter --- */}
      <div className="mb-4">
        <h6 className="text-uppercase fw-bold border-bottom pb-2">Category</h6>
        {/* 💥 FIX 5: Use the dynamic productCategories prop */}
        {productCategories.map((cat) => (
          <div className="form-check" key={cat}>
            <input
              className="form-check-input"
              type="checkbox"
              value={cat.toLowerCase()}
              onChange={handleCheckboxChange}
              checked={filters.categories.includes(cat.toLowerCase())}
              id={`cat-${cat}`}
            />
            <label className="form-check-label" htmlFor={`cat-${cat}`}>
              {cat}
            </label>
          </div>
        ))}
      </div>

      {/* --- Price Filter (Simplified Slider) --- */}
      <div className="mb-4">
        <h6 className="text-uppercase fw-bold border-bottom pb-2">Price</h6>
        <div className="d-flex justify-content-between mb-2">
          <small className="text-muted">₹0</small>
          <small className="text-muted">₹5000</small>
        </div>
        <input
          type="range"
          className="form-range"
          min="0"
          max="5000"
          step="10"
          value={maxPriceValue}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              // Price range always starts at 0 now
              priceRange: [0, Number(e.target.value)],
            }))
          }
        />
        <small className="text-muted">Max Price: ₹{maxPriceValue}</small>
      </div>

      {/* --- Rating Filter --- */}
      <div className="mb-4">
        <h6 className="text-uppercase fw-bold border-bottom pb-2">Rating</h6>
        {[4, 3, 2, 1].map((star) => (
          <div className="form-check" key={star}>
            <input
              className="form-check-input"
              type="radio"
              name="ratingFilter"
              id={`rating${star}`}
              value={star}
              onChange={handleRatingChange}
              checked={filters.rating === star}
            />
            <label className="form-check-label" htmlFor={`rating${star}`}>
              {star} Stars & above
            </label>
          </div>
        ))}
      </div>

      {/* --- Sort by Price --- */}
      <div className="mb-4">
        <h6 className="text-uppercase fw-bold border-bottom pb-2">
          Sort By Price
        </h6>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="sortPrice"
            id="priceLowToHigh"
            value="low-to-high"
            onChange={handleSortChange}
            checked={filters.sortBy === "low-to-high"}
          />
          <label className="form-check-label" htmlFor="priceLowToHigh">
            Price: Low to High
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="sortPrice"
            id="priceHighToLow"
            value="high-to-low"
            onChange={handleSortChange}
            checked={filters.sortBy === "high-to-low"}
          />
          <label className="form-check-label" htmlFor="priceHighToLow">
            Price: High to Low
          </label>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
