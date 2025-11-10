import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

// --- API Configuration (Assuming you still need it here) ---
const API_URL = "https://e-commerce-app-blush-three.vercel.app/api";

// --- Minimal FetchData Helper (Assuming it's not exported from AppContext) ---
const fetchData = async (url, method = "GET") => {
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

  // ⭐ Dynamic Size Source: Use whatever property holds the sizes (e.g., product.sizes).
  // Default to a standard array for safety if the property is missing.
  const defaultSizes = ["S", "M", "L", "XL"];
  const sizes = (
    product?.sizes ||
    product?.availableSizes ||
    defaultSizes
  ).filter(Boolean);

  // --- Derived States ---
  const isWishlisted = wishlist.some((item) => item._id === product?._id);

  const cartItem = cart.find(
    (item) => item.product?._id === product?._id && item.size === selectedSize
  );
  const isInCart = !!cartItem;

  // --- Fetch Product Data (CRITICAL UPDATE HERE) ---
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchData(`${API_URL}/products/${productId}`);
        const productData = response.product;

        setProduct(productData);

        // ⭐ FIX: Get the actual sizes from the fetched data ⭐
        // Use the same logic as the 'sizes' variable to determine the size array
        const actualSizes = (
          productData.sizes ||
          productData.availableSizes ||
          defaultSizes
        ).filter(Boolean);

        // Initialize selected size to the first valid option
        if (actualSizes.length > 0) {
          setSelectedSize(actualSizes[0]);
        } else {
          setSelectedSize(null);
          addAlert("No sizes available for this product.", "warning");
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
    if (!selectedSize) {
      addAlert("Please select a size before adding to cart.", "warning");
      return;
    }
    updateCart(product._id, "ADD", selectedSize);
  };

  const handleAddToWishlist = () => {
    updateWishlist(product._id, isWishlisted ? "REMOVE" : "ADD");
  };

  // --- Render Logic ---
  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>{" "}
        <p>Loading product...</p>{" "}
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="alert alert-danger text-center mt-5">
        {error || "Product not found."}{" "}
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-3">
      {" "}
      <div className="row">
        {/* --- Product Image Column (Left) --- */}{" "}
        <div className="col-md-6">
          {" "}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="img-fluid rounded shadow-sm"
          />{" "}
        </div>
        {/* --- Product Details Column (Right) --- */}{" "}
        <div className="col-md-6">
          <h1 className="display-4">{product.name}</h1>{" "}
          <p className="text-muted lead">{product.category}</p>
          <hr />{" "}
          <h2 className="text-success mb-3">
            ₹{product.price.toFixed(2)}
          </h2>{" "}
          <p>{product.description}</p>{" "}
          <p className="text-warning">Rating: {product.rating} / 5</p>{" "}
          {/* ⭐ SIZE SELECTION AREA (Uses the dynamic 'sizes' array) ⭐ */}{" "}
          <div className="my-4">
            <h5 className="mb-2">Select Size:</h5>{" "}
            <div className="d-flex gap-2 flex-wrap">
              {" "}
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`btn ${
                    selectedSize === size ? "btn-dark" : "btn-outline-dark"
                  }`}
                  onClick={() => setSelectedSize(size)}
                  style={{ minWidth: "40px" }}
                >
                  {size}{" "}
                </button>
              ))}{" "}
            </div>{" "}
            {!selectedSize && sizes.length > 0 && (
              <p className="text-danger mt-2">Please select a size.</p>
            )}{" "}
          </div>
          <hr /> {/* --- Actions --- */}{" "}
          <div className="d-grid gap-2 d-md-block">
            {/* Cart Button Logic: Toggle Add to Cart / Go to Cart */}
            {isInCart ? (
              <Link to="/cart" className="btn btn-success btn-lg me-3">
                Go to Cart ({cartItem.quantity} items)
              </Link>
            ) : (
              <button
                className="btn btn-primary btn-lg me-3"
                onClick={handleAddToCart}
                disabled={!selectedSize}
              >
                Add to Cart
              </button>
            )}{" "}
            <button
              className={`btn btn-${
                isWishlisted ? "danger" : "outline-danger"
              } btn-lg`}
              onClick={handleAddToWishlist}
            >
              {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};

export default ProductDetails;
