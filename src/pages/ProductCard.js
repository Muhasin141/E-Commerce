import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

// Default sizes used only as a fallback if the product data is missing size information
const DEFAULT_SIZES = ["S", "M", "L", "XL"];

const ProductCard = ({ product }) => {
  const {
    updateCart,
    updateWishlist,
    state: { cart, wishlist },
  } = useAppContext();

  // 1. DYNAMIC SIZE ARRAY DERIVATION
  // Ensure the fallback is an empty array if needed, and filter out any empty values
  const sizes = (product?.sizes || product?.availableSizes || []) // Use empty array if no sizes are explicitly provided
    .filter(Boolean);

  // 2. STATE FOR SELECTED SIZE
  // ⭐ FIX 1: Initialize to the first size, OR to an empty string ('') if no sizes exist.
  // The empty string ('') signals "no size required" and allows button handlers to run.
  const [selectedSize, setSelectedSize] = useState(
    sizes.length > 0 ? sizes[0] : ""
  );

  // --- Derived States ---

  // ⭐ FIX 2: Check if the currently selected variant is in the cart.
  // Use (item.size || "") to correctly match null sizes from context against selectedSize (which is now "" for no-size items).
  const isSelectedVariantInCart = cart.some(
    (item) =>
      item.product?._id === product._id && (item.size || "") === selectedSize
  );

  // ⭐ FIX 3: Wishlist Check - Use (item.size || "") for consistency.
  const isSelectedVariantInWishlist = wishlist.some(
    (item) =>
      item.product?._id === product._id && (item.size || "") === selectedSize
  );

  // --- Handlers ---

  const handleAddToCart = () => {
    // ⭐ FIX 4: Pass selectedSize || null. If selectedSize is "" (no size), we pass null to the context/backend.
    updateCart(product._id, "ADD", selectedSize || null);
  };

  const handleRemoveFromCart = () => {
    // ⭐ FIX 5: Pass selectedSize || null for removal logic as well.
    updateCart(product._id, "REMOVE", selectedSize || null);
  };

  const handleToggleWishlist = () => {
    const action = isSelectedVariantInWishlist ? "REMOVE" : "ADD";
    // ⭐ FIX 6: Pass selectedSize || null to update the wishlist correctly.
    updateWishlist(product._id, action, selectedSize || null);
  };

  return (
    <div className="card h-100 shadow-sm border-0">
      {/* --- Product Image & Link to Details --- */}
      <Link to={`/products/${product._id}`} className="text-decoration-none">
        <div
          className="card-img-top bg-light text-center p-3"
          style={{ height: "200px", overflow: "hidden" }}
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="img-fluid"
            style={{ maxHeight: "100%", objectFit: "contain" }}
          />
        </div>
      </Link>

      {/* --- Card Body & Details --- */}
      <div className="card-body d-flex flex-column">
        <h6 className="card-title fw-bold mb-1 text-truncate">
          <Link
            to={`/products/${product._id}`}
            className="text-dark text-decoration-none"
          >
            {product.name}
          </Link>
        </h6>

        {/* Price and Discount */}
        <div className="d-flex align-items-baseline mb-3">
          <h5 className="text-dark me-2">₹{product.price.toFixed(2)}</h5>
          <span className="text-muted text-decoration-line-through me-2">
            ₹{(product.price * 2).toFixed(2)}
          </span>
          <span className="badge bg-danger">50% off</span>
        </div>

        {/* SIZE BUTTON CHIPS */}
        {sizes.length > 0 && (
          <div className="mb-3">
            <label className="form-label small mb-1">Select Size:</label>
            <div className="d-flex gap-2 flex-wrap">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`btn btn-sm ${
                    size === selectedSize
                      ? "btn-dark shadow-sm"
                      : "btn-outline-secondary"
                  }`}
                  onClick={() => setSelectedSize(size)}
                  style={{ minWidth: "40px" }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- Action Buttons --- */}
        <div className="mt-auto d-grid gap-2">
          {/* 1. Cart Button Logic (Now enabled for no-size products) */}
          {isSelectedVariantInCart ? (
            <button className="btn btn-danger" onClick={handleRemoveFromCart}>
              Remove from Cart
            </button>
          ) : (
            <button className="btn btn-dark" onClick={handleAddToCart}>
              Add to Cart
            </button>
          )}

          {/* 2. Wishlist Button Logic (Now enabled for no-size products) */}
          <button
            className={`btn btn-${
              isSelectedVariantInWishlist
                ? "outline-danger"
                : "light text-danger border"
            }`}
            onClick={handleToggleWishlist}
          >
            {isSelectedVariantInWishlist
              ? "Remove from Wishlist"
              : "Save to Wishlist"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
