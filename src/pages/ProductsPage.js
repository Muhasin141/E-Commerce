import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import ProductFilters from "./ProductFilters";
import ProductCard from "./ProductCard";

const ProductsPage = () => {
  const {
    state: { products, loading, searchTerm: globalSearchTerm },
    updateCart,
    updateWishlist,
    fetchProducts,
  } = useAppContext();

  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");

  // State to manage if the component has completed its initial load/sync
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [filters, setFilters] = useState({
    // Initialize categories only once based on the URL parameter
    categories: initialCategory ? [initialCategory] : [],
    rating: 0,
    sortBy: null,
    priceRange: [50, 2000], // Assuming default min/max price
    searchTerm: globalSearchTerm || "",
  });

  // --- Effect 1: Handle Initial Sync (Global Search & URL Category) ---
  useEffect(() => {
    // 1. Sync Global Search Term (This must always run)
    if (filters.searchTerm !== (globalSearchTerm || "")) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        searchTerm: globalSearchTerm || "",
      }));
    }

    // 2. Handle Initial URL Category Load (Runs only on mount)
    // This ensures that the URL category is captured on first load
    // but prevents re-forcing it into state on subsequent user interactions.
    if (isInitialLoad) {
      if (initialCategory) {
        setFilters((prevFilters) => ({
          ...prevFilters,
          // Use the initialCategory found in the URL if present
          categories: [initialCategory],
        }));
      }
      // Set to false after the initial checks are done
      setIsInitialLoad(false);
    }

    // ⚠️ CRITICAL: The old logic that forced re-sync based on URL category
    // has been removed, resolving the unchecking issue.

  }, [
    globalSearchTerm,
    initialCategory,
    filters.searchTerm,
    isInitialLoad, // Depend on this flag to run the initial logic once
  ]);

  // --- Effect 2: CRITICAL: Server-Side Fetching based on ALL Filters ---
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.searchTerm) {
      params.append("q", filters.searchTerm);
    }

    // Important: If categories is empty, the parameter is not added, fetching all products.
    if (filters.categories.length > 0) {
      params.append("category", filters.categories.join(","));
    }

    if (filters.rating > 0) {
      params.append("rating", filters.rating);
    }

    if (filters.sortBy === "low-to-high") {
      params.append("sort", "priceLowToHigh");
    } else if (filters.sortBy === "high-to-low") {
      params.append("sort", "priceHighToLow");
    }

    // Generate the final query string and fetch products
    const queryString = params.toString() ? `?${params.toString()}` : "";
    fetchProducts(queryString);
  }, [
    filters.categories,
    filters.rating,
    filters.sortBy,
    filters.searchTerm,
    fetchProducts,
  ]);

  // Client-Side Price Range Filter (Post-Fetch)
  const [minPrice, maxPrice] = filters.priceRange;
  const displayProducts = products.filter(
    (p) => p.price >= minPrice && p.price <= maxPrice
  );

  const handleFilterChange = (newFilters) => {
    // This is the single source of truth for updating filters from the UI
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>{" "}
        </div>
        <p>Loading Products...</p>{" "}
      </div>
    );
  }

  return (
    <div className="container-fluid mt-5 pt-3">
      <div className="row">
        {/* --- 1. Left Column: Filters (Col-3) --- */}
        <div className="col-lg-3">
          <ProductFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            productCategories={[
              "Men-clothing",
              "Women-clothing",
              "Other",
              "Sports",
              "Kids-Clothing",
              "Home",
            ]}
            productCount={displayProducts.length}
          />
        </div>
        {/* --- 2. Right Column: Product Grid (Col-9) --- */}
        <div className="col-lg-9">
          <h1 className="my-4">Showing {displayProducts.length} Products</h1>
          <div className="row g-4">
            {displayProducts.map((product) => (
              <div key={product._id} className="col-md-6 col-lg-4 col-xl-3">
                <ProductCard
                  product={product}
                />
              </div>
            ))}
            {displayProducts.length === 0 && (
              <div className="col-12 mt-5">
                <div className="alert alert-info text-center">
                  No products match your current filters.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
