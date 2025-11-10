import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import ProductFilters from "./ProductFilters";
import ProductCard from "./ProductCard";

const ProductsPage = () => {
  const {
    state: { products, loading, searchTerm: globalSearchTerm }, // Removed 'wishlist' as it's not used here anymore
    updateCart,
    updateWishlist,
    fetchProducts,
  } = useAppContext();

  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");

  const [filters, setFilters] = useState({
    categories: initialCategory ? [initialCategory] : [],
    rating: 0,
    sortBy: null,
    priceRange: [50, 2000],
    searchTerm: globalSearchTerm || "",
  });

  // Effect to Sync Local Filters with Global Search Term
  useEffect(() => {
    if (filters.searchTerm !== (globalSearchTerm || "")) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        searchTerm: globalSearchTerm || "",
      }));
    }
    if (initialCategory && !filters.categories.includes(initialCategory)) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        categories: [initialCategory],
      }));
    }
  }, [
    globalSearchTerm,
    initialCategory,
    filters.searchTerm,
    filters.categories,
  ]);

  // CRITICAL: EFFECT for Server-Side Fetching
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.searchTerm) {
      params.append("q", filters.searchTerm);
    }

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
    setFilters(newFilters);
  };

  // ⭐ NOTE: Removed the redundant isWishlisted function

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
                  // NOTE: updateCart and updateWishlist require the size parameter now!
                  // The ProductCard component is assumed to handle the size selection
                  // and call the context functions directly.
                  // If ProductCard is receiving size via props, it needs to be updated.
                  // However, based on the previous solution, ProductCard uses context directly.
                  // We will keep the props clean and let ProductCard handle context access.
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
