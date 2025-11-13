import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

// --- API Configuration and fetchData helper (kept for context) ---
const API_URL = "https://e-commerce-app-blush-three.vercel.app/api";
const fetchData = async (url, method = "GET") => {
  // ... (rest of fetchData implementation)
  const options = { method };
  const response = await fetch(url, options);
  if (!response.ok) {
    let errorDetails = `HTTP error! Status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorDetails = errorData.message || errorDetails;
    } catch (e) {
      const errorText = await response.text();
      errorDetails = errorText.length < 200 ? errorText.trim() : errorDetails;
    }
    throw new Error(errorDetails);
  }
  return await response.json();
};
// --------------------------------------------------------

const ProductDetails = () => {
  const { productId } = useParams();

  const {
    updateCart,
    updateWishlist,
    addAlert,
    state: { wishlist, cart },
  } = useAppContext();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // Flag to check if the product actually requires size selection
  const [requiresSize, setRequiresSize] = useState(false);

  // Dynamic Size Source
  const defaultSizes = ["S", "M", "L", "XL"];
  const sizes = (
    product?.sizes ||
    product?.availableSizes ||
    defaultSizes
  ).filter(Boolean);

  // --- Derived States ---
  const isWishlisted = wishlist.some((item) => item._id === product?._id);

  // Find the cart item, checking for size only if requiredSize is true
  const cartItem = cart.find(
    (item) =>
      item.product?._id === product?._id &&
      (requiresSize ? item.size === selectedSize : true) // Match any size if not required
  );
  const isInCart = !!cartItem;

  // --- Fetch Product Data ---
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchData(`${API_URL}/products/${productId}`);
        const productData = response.product;
        setProduct(productData);

        // Determine actual sizes
        const actualSizes = (
          productData.sizes ||
          productData.availableSizes ||
          []
        ) // Use empty array if no sizes found in data
          .filter(Boolean);

        const hasSizes = actualSizes.length > 0;
        setRequiresSize(hasSizes);

        if (hasSizes) {
          // If sizes exist, set the first one as selected
          setSelectedSize(actualSizes[0]);
        } else {
          // If no sizes exist, set a dummy value ("N/A") to enable ADD TO CART
          setSelectedSize("N/A");
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError(err.message || "Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, addAlert]);

  // --- Handlers ---
  const handleAddToCart = () => {
    // Only enforce size selection if the product REQUIRES it AND no size is selected
    if (requiresSize && !selectedSize) {
      addAlert("Please select a size before adding to cart.", "warning");
      return;
    }
    // If not required, selectedSize is "N/A" which is passed to the API
    // If required, the selected size (e.g., "M") is passed to the API
    updateCart(product._id, "ADD", selectedSize);
  };

  const handleAddToWishlist = () => {
    updateWishlist(product._id, isWishlisted ? "REMOVE" : "ADD");
  };

  // --- Render Logic ---
  if (loading) {
    // ... (Loading state unchanged)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>{" "}
        <p>Loading product...</p>{" "}
      </div>
    );
  }

  if (error || !product) {
    // ... (Error state unchanged)
    return (
      <div className="alert alert-danger text-center mt-5">
        {error || "Product not found."}{" "}
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-3">
      <div className="row">
        {/* --- Product Image Column (Left) --- */}
        <div className="col-md-6">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="img-fluid rounded shadow-sm"
          />
        </div>
        {/* --- Product Details Column (Right) --- */}
        <div className="col-md-6">
          <h1 className="display-4">{product.name}</h1>
          <p className="text-muted lead">{product.category}</p>
          <hr />
          <h2 className="text-success mb-3">₹{product.price.toFixed(2)}</h2>
          <p>{product.description}</p>
          <p className="text-warning">Rating: {product.rating} / 5</p>

          {/* ⭐ CONDITIONAL SIZE SELECTION AREA ⭐ */}
          {requiresSize && (
            <div className="my-4">
              <h5 className="mb-2">Select Size:</h5>
              <div className="d-flex gap-2 flex-wrap">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`btn ${
                      selectedSize === size ? "btn-dark" : "btn-outline-dark"
                    }`}
                    onClick={() => setSelectedSize(size)}
                    style={{ minWidth: "40px" }}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {!selectedSize && sizes.length > 0 && (
                <p className="text-danger mt-2">Please select a size.</p>
              )}
            </div>
          )}
          <hr />
          {/* --- Actions --- */}
          <div className="d-grid gap-2 d-md-block">
            {/* Cart Button: Disabled only if size is required and not selected */}
            {isInCart ? (
              <Link to="/cart" className="btn btn-success btn-lg me-3">
                Go to Cart ({cartItem.quantity} items)
              </Link>
            ) : (
              <button
                className="btn btn-primary btn-lg me-3"
                onClick={handleAddToCart}
                // Button is disabled if: size is required AND selectedSize is null
                disabled={requiresSize && !selectedSize}
              >
                Add to Cart
              </button>
            )}
            <button
              className={`btn btn-${
                isWishlisted ? "danger" : "outline-danger"
              } btn-lg`}
              onClick={handleAddToWishlist}
            >
              {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

