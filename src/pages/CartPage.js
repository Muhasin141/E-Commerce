import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

const calculateTotal = (cart) =>
  cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

const CartPage = () => {
  const {
    state: { cart, loading },
    updateCart,
    updateWishlist,
  } = useAppContext();

  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
        <p>Loading Cart...</p>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h2>Your Cart is Empty 😔</h2>
        <Link to="/products" className="btn btn-primary mt-3">
          Start Shopping
        </Link>
      </div>
    );
  }

  const totalAmount = calculateTotal(cart);
  const cartItemString = `${cart.length} item${cart.length !== 1 ? "s" : ""}`;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Your Shopping Cart</h2>

      <div className="row">
        {/* LEFT SIDE - CART ITEMS */}
        <div className="col-lg-8">
          {cart.map((item) => {
            const product = item.product;
            const subtotal = product.price * item.quantity;

            return (
              <div
                key={`${product._id}-${item.size}`}
                className="card mb-3 shadow-sm"
              >
                <div className="card-body">
                  <div className="d-flex">
                    {/* Image */}
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      style={{
                        width: "90px",
                        height: "90px",
                        objectFit: "cover",
                      }}
                      className="rounded me-3"
                    />

                    {/* Product Info */}
                    <div className="flex-grow-1">
                      <h5 className="mb-1">{product.name}</h5>

                      {item.size && (
                        <p className="text-muted small mb-1">
                          Size: {item.size}
                        </p>
                      )}

                      <p className="small text-muted mb-1">
                        Price: ₹{product.price.toFixed(2)}
                      </p>

                      <p className="fw-bold mb-2">
                        Subtotal: ₹{subtotal.toFixed(2)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="d-flex align-items-center mb-2">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() =>
                            updateCart(product._id, "DECREMENT", item.size)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <i className="bi bi-dash"></i>
                        </button>

                        <span className="mx-2 fw-semibold">
                          {item.quantity}
                        </span>

                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() =>
                            updateCart(product._id, "ADD", item.size)
                          }
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>

                      {/* Action Buttons */}
                      <div className="d-flex">
                        <button
                          className="btn btn-outline-danger btn-sm me-2"
                          onClick={() =>
                            updateCart(product._id, "REMOVE", item.size)
                          }
                        >
                          <i className="bi bi-trash"></i> Remove
                        </button>

                        <button
                          className="btn btn-outline-info btn-sm"
                          onClick={() => {
                            updateWishlist(product._id, "ADD", item.size);
                            updateCart(product._id, "REMOVE", item.size);
                          }}
                        >
                          <i className="bi bi-heart"></i> Move to Wishlist
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT SIDE - SUMMARY */}
        <div className="col-lg-4">
          <div className="card shadow-sm sticky-top" style={{ top: "80px" }}>
            <div className="card-body">
              <h5 className="card-title">Summary</h5>

              <ul className="list-group mb-3">
                <li className="list-group-item d-flex justify-content-between">
                  <span>Subtotal ({cartItemString})</span>
                  <strong>₹{totalAmount.toFixed(2)}</strong>
                </li>
                <li className="list-group-item d-flex justify-content-between text-success">
                  <span>Shipping</span>
                  <strong>FREE</strong>
                </li>
                <li className="list-group-item d-flex justify-content-between fs-5 bg-light">
                  <strong>Total</strong>
                  <strong>₹{totalAmount.toFixed(2)}</strong>
                </li>
              </ul>

              <button
                className="btn btn-success w-100 mb-2"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>

              <Link to="/products" className="btn btn-outline-secondary w-100">
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

