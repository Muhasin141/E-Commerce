import React, { useState, useEffect } from "react";
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

const CheckoutPage = () => {
  const {
    state: { cart, loading, userDetails },
    placeOrder,
    addAlert,
  } = useAppContext();

  const navigate = useNavigate();

  // Correctly access the addresses list
  const addresses = userDetails?.addresses || [];
  const totalAmount = calculateTotal(cart);

  // State to track the currently selected address ID
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Effect for Initial Address Selection ---
  useEffect(() => {
    // 1. If addresses are available and none is currently selected:
    if (addresses.length > 0 && !selectedAddressId) {
      // Prioritize the default address, otherwise use the first one
      const defaultAddress = addresses.find((addr) => addr.isDefault);
      setSelectedAddressId((defaultAddress || addresses[0])._id);
    }
    // If the addresses become empty after selection, clear selection
    else if (addresses.length === 0 && selectedAddressId) {
      setSelectedAddressId(null);
    }
  }, [addresses, selectedAddressId]);

  // --- Early Returns for Loading, Empty Cart, and Missing Address ---

  if (loading) {
    return (
      <div className="text-center mt-5 pt-3">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Loading data...</p>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="container mt-5 pt-5 text-center">
        <h2 className="mb-4">Cart is Empty</h2>
        <p>Please add items to your cart before checking out.</p>
        <Link to="/products" className="btn btn-primary btn-lg mt-3">
          Go to Shop
        </Link>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="container mt-5 pt-5 text-center">
        <h2 className="mb-4 text-warning">Shipping Address Required</h2>
        <p>
          You must add a delivery address to your profile before placing an
          order.
        </p>
        <Link to="/profile" className="btn btn-warning btn-lg mt-3">
          Add Address Now
        </Link>
      </div>
    );
  }

  // --- Handler for Placing the Order ---

  const handlePlaceOrder = async () => {
    if (isProcessing || !selectedAddressId || totalAmount === 0) return;

    setIsProcessing(true);

    try {
      const response = await placeOrder(selectedAddressId, totalAmount);

      if (response && response.orderId) {
        // SUCCESS: Navigate to the order success page
        navigate(`/order-success/${response.orderId}`, {
          state: {
            totalAmount: totalAmount,
            message: response.message || "Your order was placed successfully!",
          },
        });
      } else {
        // FAILURE: If placeOrder didn't throw but didn't return an ID
        addAlert("Order processing failed due to an unknown issue.", "danger");
      }
    } catch (error) {
      console.error("Order finalization failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Rendered Component ---

  return (
    <div className="container mt-5 pt-3">
      <h1 className="mb-4">
        <span
          className="me-2 text-primary"
          style={{ transform: "rotate(90deg)", display: "inline-block" }}
        >
          &gt;
        </span>
        Order Checkout
      </h1>

      <div className="row">
        {/* --- Left Column: Address Selection & Order Review --- */}
        <div className="col-lg-8">
          {/* Section 1: Address Selection */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">1. Select Delivery Address</h5>
            </div>
            <div className="card-body">
              <div className="list-group">
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className={`list-group-item list-group-item-action ${
                      // 🎨 FIX: Use text-dark to force visibility when active
                      selectedAddressId === address._id
                        ? "active bg-light text-dark"
                        : "text-dark"
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedAddressId(address._id)}
                  >
                    <div className="d-flex w-100 justify-content-between align-items-center">
                      {/* 🎨 FIX: Ensure header text is dark */}
                      <h6 className="mb-1 fw-bold text-dark">
                        {address.fullName}
                      </h6>
                      {selectedAddressId === address._id && (
                        <span className="text-success fs-5 me-2">&#10003;</span> // Checkmark remains visible
                      )}
                    </div>
                    {/* 🎨 FIX: Use text-secondary or text-muted for the main address lines */}
                    <p className="mb-1 small text-secondary">
                      {address.street}, {address.city}, {address.state} -{" "}
                      {address.zipCode}
                      {address.isDefault && (
                        <span className="badge bg-secondary ms-2">Default</span>
                      )}
                    </p>
                    <small className="text-muted">Phone: {address.phone}</small>
                  </div>
                ))}
              </div>
              <Link
                to="/profile"
                className="btn btn-outline-primary btn-sm mt-3"
              >
                Manage Addresses
              </Link>
            </div>
          </div>

          {/* Section 2: Review Items (Simple List) */}
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">2. Order Review ({cart.length} Items)</h5>
            </div>
            <ul className="list-group list-group-flush">
              {cart.map((item) => (
                <li
                  key={`${item.product._id}-${item.size}`}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={item.product.imageUrl || "placeholder.jpg"}
                      alt={item.product.name}
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                      }}
                      className="me-2 rounded"
                    />
                    <span>
                      {item.product.name} ({item.size})
                    </span>
                  </div>
                  <span className="badge bg-secondary rounded-pill">
                    Qty: {item.quantity}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* --- Right Column: Order Summary & Place Order Button --- */}
        <div className="col-lg-4">
          <div className="card shadow-sm sticky-top" style={{ top: "75px" }}>
            <div className="card-body">
              <h5 className="card-title mb-4">3. Final Summary</h5>

              {/* Price Breakdown */}
              <ul className="list-group list-group-flush mb-4">
                <li className="list-group-item d-flex justify-content-between">
                  <span>Items Subtotal:</span>
                  <span className="fw-bold">₹{totalAmount.toFixed(2)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between text-success">
                  <span>Shipping:</span>
                  <span className="fw-bold">FREE</span>
                </li>
                <li className="list-group-item d-flex justify-content-between fs-5 bg-light">
                  <strong>Order Total:</strong>
                  <strong>₹{totalAmount.toFixed(2)}</strong>
                </li>
              </ul>

              {/* Place Order Button */}
              <button
                className="btn btn-success d-block w-100 btn-lg"
                onClick={handlePlaceOrder}
                disabled={
                  isProcessing || totalAmount === 0 || !selectedAddressId
                }
              >
                {isProcessing ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Placing Order...
                  </>
                ) : (
                  `Place Order Now`
                )}
              </button>

              {!selectedAddressId && addresses.length > 0 && (
                <div className="alert alert-warning mt-2 p-2 small text-center">
                  Please select a shipping address.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
