import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext"; // Adjust path if necessary

const WishlistPage = () => {
  const {
    state: { wishlist, loading: appLoading },
    updateCart,
    updateWishlist,
    clearWishlist,
  } = useAppContext();

  const navigate = useNavigate();

  // State to track which items have been successfully moved to cart
  // We use a composite key (productId-size) to handle product variants correctly.
  const [movedItems, setMovedItems] = useState({});

  const wishlistItems = wishlist;

  // Helper function to generate a unique key for the item based on its ID and Size (variant)
  const generateItemKey = (productId, size) =>
    `${productId}-${size || "default"}`;

  // --- Handler for moving the item from wishlist to cart ---
  const handleMoveToCart = async (productId, selectedSize) => {
    const itemKey = generateItemKey(productId, selectedSize);

    try {
      // 1. Add to Cart (ADD action)
      await updateCart(productId, "ADD", selectedSize);

      // 2. Remove from Wishlist (REMOVE action)
      await updateWishlist(productId, "REMOVE", selectedSize);

      // 3. Update local state to show 'View Cart' button
      setMovedItems((prev) => ({ ...prev, [itemKey]: true }));
    } catch (error) {
      console.error("Failed to execute Move to Cart action:", error);
    }
  };

  // --- 1. Handle Global Loading State ⏳ ---
  if (appLoading) {
    return (
      <div className="container mt-5 pt-3 text-center">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading wishlist...</span>
        </div>
        <p className="mt-2">Fetching your favorite items...</p>
      </div>
    );
  } // <-- This closing brace is crucial for the Syntax Error fix

  // --- 2. Check if the Wishlist is Actually Empty 🛒 ---
  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="container mt-5 pt-3">
        <div className="alert alert-warning text-center shadow-sm" role="alert">
          <h4 className="alert-heading">💖 Your Wishlist is Empty!</h4>
          <p>
            Found an item you like? Click the heart icon to save it here for
            later.
          </p>
          <Link to="/products" className="btn btn-warning mt-2">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // --- 3. Render Wishlist Contents 📝 ---
  return (
    <div className="container mt-5 pt-3">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
        <h1 className="mb-0">My Wishlist ({wishlistItems.length})</h1>
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={clearWishlist}
          title="Remove all items from the wishlist"
        >
          Clear All
        </button>
      </div>

      <div className="row g-4">
        {wishlistItems.map((item) => {
          const product = item.product;
          const selectedSize = item.size;

          if (!product || !product._id) return null; // Skip if product data is missing

          const itemKey = generateItemKey(product._id, selectedSize);
          const isMoved = movedItems[itemKey];

          return (
            <div key={itemKey} className="col-lg-3 col-md-4 col-sm-6">
              <div className="card h-100 shadow-sm">
                {/* Heart icon for visual confirmation */}
                <div className="position-absolute top-0 end-0 p-2">
                  <i className="bi bi-heart-fill text-danger fs-5"></i>
                </div>

                <div className="card-img-top bg-light text-center p-4">
                  <Link to={`/products/${product._id}`}>
                    <img
                      src={product.imageUrl || "placeholder.jpg"}
                      alt={product.name}
                      className="img-fluid"
                      style={{ maxHeight: "180px", objectFit: "contain" }}
                    />
                  </Link>
                </div>

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-truncate">{product.name}</h5>
                  <h4 className="text-primary mb-3">
                    **₹{product.price?.toFixed(2) || "N/A"}**
                  </h4>
                  <p className="text-muted small">
                    Size: **{selectedSize || "Default"}**
                  </p>

                  <div className="mt-auto">
                    {isMoved ? (
                      // If moved, show 'View Cart' button
                      <button
                        onClick={() => navigate("/cart")}
                        className="btn btn-success w-100 mb-2"
                      >
                        View Cart
                      </button>
                    ) : (
                      // Otherwise, show 'Move to Cart' button
                      <button
                        onClick={() =>
                          handleMoveToCart(product._id, selectedSize)
                        }
                        className="btn btn-primary w-100 mb-2"
                      >
                        Move to Cart
                      </button>
                    )}

                    <button
                      onClick={() =>
                        // Always allow direct removal
                        updateWishlist(product._id, "REMOVE", selectedSize)
                      }
                      className="btn btn-outline-danger w-100"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistPage;
