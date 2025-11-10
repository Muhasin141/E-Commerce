import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

// Helper function to calculate the cart total (Keep this)
const calculateTotal = (cart) => {
  return cart.reduce((total, item) => {
    const price = item.product?.price || 0;
    const quantity = item.quantity || 0;
    return total + price * quantity;
  }, 0);
};

// Component for a single cart item row (FIXED: Whitespace removed inside <td> tags)
const CartItemRow = ({ item, updateCart, updateWishlist }) => {
  const product = item.product;

  if (!product) {
    return null;
  }

  const handleIncrement = () => {
    updateCart(product._id, "ADD", item.size);
  };

  const handleDecrement = () => {
    updateCart(product._id, "DECREMENT", item.size);
  };

  const handleRemove = () => {
    updateCart(product._id, "REMOVE", item.size);
  };

  // Handles moving the item from cart to wishlist
  const handleMoveToWishlist = () => {
    // 1. Add item to wishlist
    updateWishlist(product._id, "ADD", item.size);
    // 2. Remove the line item entirely from cart
    updateCart(product._id, "REMOVE", item.size);
  };

  return (
    <tr className="align-middle">
      {/* Product Image and Name (Column 1) - Content moved to start of line */}
      <td>
        <div className="d-flex align-items-center">
          <img
            src={product.imageUrl || "placeholder.jpg"}
            alt={product.name}
            style={{ width: "80px", height: "80px", objectFit: "cover" }}
            className="me-3 rounded"
          />
          <div>
            <Link
              to={`/products/${product._id}`}
              className="text-decoration-none fw-bold text-dark"
            >
              {product.name}
            </Link>
            {item.size && (
              <p className="text-muted small mb-0">Size: **{item.size}**</p>
            )}
          </div>
        </div>
      </td>

      {/* Price (Column 2) - Content moved to start of line */}
      <td>₹{product.price.toFixed(2)}</td>

      {/* Quantity Controls (Column 3) - Content moved to start of line */}
      <td>
        <div className="d-flex align-items-center">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={handleDecrement}
            disabled={item.quantity <= 1}
          >
            <i className="bi bi-dash"></i>
          </button>
          <span className="mx-2 fs-5">{item.quantity}</span>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={handleIncrement}
          >
            <i className="bi bi-plus"></i>
          </button>
        </div>
      </td>

      {/* Subtotal (Column 4) - Content moved to start of line */}
      <td className="fw-bold">₹{(product.price * item.quantity).toFixed(2)}</td>

      {/* Remove & Move to Wishlist (Column 5) - Content moved to start of line */}
      <td>
        <div className="d-flex align-items-center justify-content-center">
          {/* 1. Remove Button (Left) */}
          <button
            className="btn btn-sm btn-outline-danger me-2"
            onClick={handleRemove}
            title={`Remove this specific item (${item.size})`}
          >
            <i className="bi bi-trash"></i>
          </button>

          {/* 2. Move to Wishlist Button (Right) */}
          <button
            className="btn btn-sm btn-outline-info"
            onClick={handleMoveToWishlist}
            title="Move item to wishlist"
          >
            <i className="bi bi-heart"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

// Main CartPage component
const CartPage = () => {
  const {
    state: { cart, loading, userDetails },
    updateCart,
    updateWishlist,
    placeOrder,
    addAlert,
  } = useAppContext();

  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const totalAmount = calculateTotal(cart);
  const hasAddress = userDetails?.addresses?.length > 0;

  const handleCheckout = async () => {
    if (isPlacingOrder || totalAmount === 0 || !hasAddress) return;

    const defaultAddress = userDetails?.addresses?.[0];

    if (!defaultAddress) {
      addAlert("Order requires at least one saved delivery address.", "danger");
      return;
    }

    setIsPlacingOrder(true);

    try {
      const response = await placeOrder(defaultAddress._id, totalAmount);

      navigate(`/order-success/${response.orderId}`, {
        state: {
          totalAmount: totalAmount,
          message: response.message || "Order processed successfully.",
        },
      });
    } catch (error) {
      console.error("Final checkout handling failed:", error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // --- 1. Loading State Check (Early Return) ---
  if (loading) {
    return (
      <div className="text-center mt-5 pt-3">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Loading Cart...</p>
      </div>
    );
  }
  // ------------------------------------------------------------------
  // --- 2. Empty Cart State Check (Early Return) ---
  if (!cart || cart.length === 0) {
    return (
      <div className="container mt-5 pt-5 text-center">
        <h2 className="mb-4">Your Cart is Empty 😔</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="btn btn-primary btn-lg mt-3">
          Start Shopping
        </Link>
      </div>
    );
  }

  // --- 3. Main Cart Content Return ---
  return (
    <div className="container mt-5 pt-3">
      <h1 className="mb-4">
        Your Shopping Cart ({cart.length} item{cart.length !== 1 ? "s" : ""})
      </h1>
      <div className="row">
        {/* --- Left Column: Cart Items (Table) --- */}
        <div className="col-lg-8">
          <div className="table-responsive shadow-sm bg-white rounded">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col">Price</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Subtotal</th>
                  <th scope="col" className="text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* FIX APPLIED HERE: Ensure map content starts/ends without extra newlines */}
                {cart.map((item) => (
                  <CartItemRow
                    key={`${item.product?._id}-${item.size || "no-size"}`}
                    item={item}
                    updateCart={updateCart}
                    updateWishlist={updateWishlist}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- Right Column: Summary & Checkout --- */}
        <div className="col-lg-4">
          <div className="card shadow-sm sticky-top" style={{ top: "75px" }}>
            <div className="card-body">
              <h5 className="card-title mb-4">Summary</h5>
              <ul className="list-group list-group-flush mb-4">
                <li className="list-group-item d-flex justify-content-between">
                  <span>Subtotal ({cart.length} items):</span>
                  <span className="fw-bold">₹{totalAmount.toFixed(2)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between text-success">
                  <span>Shipping (Standard):</span>
                  <span className="fw-bold">FREE</span>
                </li>
                <li className="list-group-item d-flex justify-content-between fs-5 bg-light">
                  <strong>Order Total:</strong>
                  <strong>₹{totalAmount.toFixed(2)}</strong>
                </li>
              </ul>

              {/* Checkout Button */}
              <button
                className="btn btn-success d-block btn-lg"
                onClick={handleCheckout}
                disabled={isPlacingOrder || totalAmount === 0 || !hasAddress}
              >
                {isPlacingOrder ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Processing...
                  </>
                ) : (
                  `Proceed to Order Confirmation`
                )}
              </button>

              {/* Alert if address is missing */}
              {!hasAddress && (
                <div className="alert alert-danger mt-2 p-2 small">
                  Please add an address in your{" "}
                  <Link to="/profile">Profile</Link> to checkout.
                </div>
              )}

              <Link
                to="/products"
                className="btn btn-outline-secondary d-block mt-2"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
