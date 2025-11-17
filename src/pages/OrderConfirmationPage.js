import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

const OrderConfirmPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const { totalAmount, message } = location.state || {};
  const { addAlert } = useAppContext();

  const [confirmationStatus, setConfirmationStatus] = useState(false);

  // ⭐ FIX: Use a useRef hook to track if the alert has fired, ignoring Strict Mode's double-render.
  const alertFiredRef = useRef(false);

  // --- Side Effect: Confirmation Alert ---
  useEffect(() => {
    if (orderId && totalAmount) {
      setConfirmationStatus(true);

      // ⭐️ CHECK THE FLAG BEFORE FIRING THE ALERT
      if (!alertFiredRef.current) {
        addAlert(
          message || "Your order has been placed successfully!",
          "success",
          5000
        );
        alertFiredRef.current = true; // Set flag so it won't fire again
      }

      // NOTE: Data refresh (cart/orders) relies on the backend and
      // the user visiting the order history page due to AppContext limitations.
    } else {
      // Handle missing details (direct navigation or refresh)
      addAlert(
        "Could not retrieve order details. Please check your order history.",
        "warning"
      );
    }
  }, [orderId, totalAmount, message, addAlert]);

  // --- Render Logic ---

  if (!orderId || !confirmationStatus) {
    return (
      <div className="container mt-5 pt-3 text-center">
        <h1 className="text-danger">Order Details Missing</h1>
        <p>
          We encountered an issue loading your order. Please visit your{" "}
          <Link to="/orders">Order History</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-3">
      <div className="card shadow-lg border-0">
        <div className="card-body p-5 text-center">
          <h1 className="text-success mb-3">
            <i className="bi bi-check-circle-fill me-2"></i> Order Confirmed!
          </h1>

          <p className="lead mb-4">
            {message ||
              "Thank  you for your purchase. Your order is being processed."}
          </p>

          <hr className="my-4" />

          <div className="row text-start justify-content-center">
            <div className="col-md-8">
              <h5 className="mb-3">Order Summary</h5>
              <ul className="list-group list-group-flush mb-4">
                <li className="list-group-item d-flex justify-content-between">
                  <span>Order ID:</span>
                  <span className="fw-bold text-primary">{orderId}</span>
                </li>

                <li className="list-group-item d-flex justify-content-between">
                  <span>Payment Status:</span>
                  <span className="text-success fw-bold">Success</span>
                </li>

                <li className="list-group-item d-flex justify-content-between fs-5 bg-light">
                  <span>Order Total:</span>
                  <span className="fw-bold text-dark">
                    ${(Number(totalAmount) || 0).toFixed(2)}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-4 d-flex justify-content-center gap-3">
            <Link to="/products" className="btn btn-outline-primary btn-lg">
              Continue Shopping
            </Link>
            <Link to={`/order/${orderId}`} className="btn btn-info btn-lg">
              View Order Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmPage;


