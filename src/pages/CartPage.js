import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

// Helper function to calculate the cart total
const calculateTotal = (cart) => {
  return cart.reduce((total, item) => {
    const price = item.product?.price || 0;
    const quantity = item.quantity || 0;
    return total + price * quantity;
  }, 0);
};

// Component for a single cart item row
const CartItemRow = ({ item, updateCart, updateWishlist }) => {
  const product = item.product;

  if (!product) {
    return null;
  }

  const itemTotal = product.price * item.quantity;

  const handleIncrement = () => {
    updateCart(product._id, "ADD", item.size);
  };

  const handleDecrement = () => {
    updateCart(product._id, "DECREMENT", item.size);
  };

  const handleRemove = () => {
    updateCart(product._id, "REMOVE", item.size);
  };

  const handleMoveToWishlist = () => {
    updateWishlist(product._id, "ADD", item.size);
    updateCart(product._id, "REMOVE", item.size);
  };

  return (
    <tr className="align-middle">
      {/* Product Image and Name (Column 1) */}
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
            {/* Display price and subtotal inline on mobile for context */}
            <p className="d-block d-sm-none text-muted small mt-1 mb-0">
              Unit Price: ₹{product.price.toFixed(2)}
            </p>
            <p className="d-block d-sm-none fw-bold small">
              Total: ₹{itemTotal.toFixed(2)}
            </p>
          </div>
        </div>
      </td>

      {/* Price (Column 2) - Hidden on extra-small screens */}
      <td className="d-none d-sm-table-cell">₹{product.price.toFixed(2)}</td>

      {/* Quantity Controls (Column 3) - Ensuring tight horizontal spacing */}
      <td style={{ width: "100px" }}>
        <div className="d-flex align-items-center">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={handleDecrement}
            disabled={item.quantity <= 1}
          >
            <i className="bi bi-dash"></i>
          </button>
          {/* Reduced font size for quantity on mobile */}
          <span className="mx-2 small">{item.quantity}</span>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={handleIncrement}
          >
            <i className="bi bi-plus"></i>
          </button>
        </div>
      </td>

      {/* Subtotal (Column 4) - Hidden on extra-small screens */}
      <td className="fw-bold d-none d-sm-table-cell">
        ₹{itemTotal.toFixed(2)}
      </td>

      {/* Action (Column 5) - Fixed width for mobile to prevent overflow */}
      <td style={{ width: "95px" }}>
        <div className="d-flex align-items-center justify-content-center">
          {/* Remove Button */}
          <button
            className="btn btn-sm btn-outline-danger me-1"
            onClick={handleRemove}
            title={`Remove this specific item (${item.size})`}
          >
            <i className="bi bi-trash"></i>
          </button>

          {/* Move to Wishlist Button */}
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
    state: { cart, loading },
    updateCart,
    updateWishlist,
  } = useAppContext();

  const navigate = useNavigate();

  const totalAmount = calculateTotal(cart);

  // FIX: Define item count string separately to ensure clean JSX interpolation
  const cartItemString = `${cart.length} item${cart.length !== 1 ? "s" : ""}`;

  const handleCheckout = () => {
    if (totalAmount === 0) {
      return;
    }
    navigate("/checkout");
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
    // FIX: px-0 on mobile, px-md-3 on desktop. This removes the root horizontal overflow.
    <div className="container-fluid mt-5 pt-3 px-0 px-md-3">
      {/* Adding manual padding to the heading since the container is px-0 */}
      <h1 className="mb-4 px-3">Your Shopping Cart ({cartItemString})</h1>
      <div className="row">
        {/* --- Left Column: Cart Items (Table) --- */}
        <div className="col-lg-8">
          {/* Added p-3 here to restore interior spacing */}
          <div className="table-responsive shadow-sm bg-white rounded p-3">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col">Product</th>
                  {/* Hides Price column on extra-small screens */}
                  <th scope="col" className="d-none d-sm-table-cell">
                    Price
                  </th>
                  <th scope="col" style={{ width: "100px" }}>
                    Qty
                  </th>
                  {/* Hides Subtotal column on extra-small screens */}
                  <th scope="col" className="d-none d-sm-table-cell">
                    Subtotal
                  </th>
                  {/* Hides Action header on extra-small screens to avoid cutoff */}
                  <th
                    scope="col"
                    className="text-center d-none d-sm-table-cell"
                    style={{ width: "95px" }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
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
          <div
            className="card shadow-sm sticky-top mb-4"
            style={{ top: "75px" }}
          >
            <div className="card-body">
              <h5 className="card-title mb-4">Summary</h5>
              <ul className="list-group list-group-flush mb-4">
                <li className="list-group-item d-flex justify-content-between">
                  <span>Subtotal ({cartItemString}):</span>
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

              {/* MODIFIED: Centering the button using w-75 and mx-auto */}
              <div className="d-flex flex-column align-items-center">
                <button
                  className="btn btn-success btn-lg w-75 mx-auto"
                  onClick={handleCheckout}
                  disabled={totalAmount === 0}
                >
                  Proceed to Checkout
                </button>
              </div>

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

