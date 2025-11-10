import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

// Removed all 'react-icons/fa' imports

// ⚠️ IMPORTANT: Replace with your actual backend URL if different
const API_URL = "https://e-commerce-app-blush-three.vercel.app/api";

const OrderDetails = () => {
  const { orderId } = useParams();
  const { addAlert } = useAppContext();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const alertFiredRef = useRef(false);

  // --- UPDATED: Returns only class and a text prefix instead of an icon component ---
  const getStatusDisplay = (status) => {
    switch (status) {
      case "Delivered":
        // Use a simple checkmark or text
        return { class: "success", text: "✓" };
      case "Shipped":
        // Use a truck/shipping symbol or text
        return { class: "info", text: "🚚" };
      case "Canceled":
        // Use a cross or text
        return { class: "danger", text: "✖" };
      case "Processing":
      default:
        // Use a clock or text
        return { class: "warning", text: "⏳" };
    }
  }; // --- API Helper for Fetching Order Details ---

  const fetchOrderDetails = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/user/order/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to fetch order: ${response.status}`
        );
      }

      const data = await response.json();
      setOrder(data.order);
    } catch (err) {
      console.error("Error fetching order details:", err);
      const errorMessage = err.message || "Could not load order details.";
      setError(errorMessage);

      if (!alertFiredRef.current) {
        addAlert(`Error: ${errorMessage}`, "danger");
        alertFiredRef.current = true;
      }
    } finally {
      setLoading(false);
    }
  }, [orderId, addAlert]);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [fetchOrderDetails, orderId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="container mt-5 pt-3 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading Order Details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mt-5 pt-3">
        <div className="alert alert-danger">
          <h4>Error Loading Order</h4>
          <p>{error || "The requested order could not be found."}</p>
          <Link to="/orders" className="btn btn-danger mt-2">
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  const { items, totalAmount, shippingAddress, orderStatus, createdAt } = order;
  const statusDisplay = getStatusDisplay(orderStatus);

  return (
    <div className="container mt-5 pt-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Order #{orderId.slice(-6)}</h1>
        {/* --- UPDATED: Displays text/emoji instead of imported icon --- */}
        <span className={`badge bg-${statusDisplay.class} fs-5`}>
          {statusDisplay.text} {orderStatus}
        </span>
      </div>
      <p className="text-muted">Placed on: {formatDate(createdAt)}</p>
      <hr />
      <div className="row">
        {/* 1. Shipping Information */}
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-primary">Shipping Address</h5>
              <address className="mb-0">
                <strong>{shippingAddress.fullName}</strong>
                <br /> {shippingAddress.street}, {shippingAddress.city}
                <br /> {shippingAddress.state}, {shippingAddress.zipCode}
                <br /> Phone: {shippingAddress.phone}
              </address>
            </div>
          </div>
        </div>
        {/* 2. Order Summary */}
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-primary">Order Summary</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between">
                  <span>Items Subtotal:</span>
                  <span className="fw-bold">₹{totalAmount.toFixed(2)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Shipping & Handling:</span>
                  <span>₹0.00</span>
                </li>
                <li className="list-group-item d-flex justify-content-between bg-light fs-5">
                  <strong>Order Total:</strong>
                  <strong className="text-success">
                    ₹{totalAmount.toFixed(2)}
                  </strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* 3. Actions (Simplified) */}
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-primary">Actions</h5>
              <Link to="/products" className="btn btn-primary w-100">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* 4. Order Items List */}
      <h2 className="mt-4 mb-3">Items ({items.length})</h2>
      <div className="list-group shadow-sm mb-5">
        {items.map((item, index) => (
          <div
            key={index}
            className="list-group-item list-group-item-action d-flex align-items-center py-3"
          >
            {/* Item Image: Accessing item.product?.imageUrl (needs population) */}

            <div className="flex-grow-1">
              {/* ⭐ Logic Fix: Access item.name directly */}
              <h5 className="mb-1">{item.name || "Product"}</h5>

              {/* Display Size if available */}
              {item.size && (
                <p className="mb-1 text-secondary">
                  Size: <span className="fw-bold">{item.size}</span>
                </p>
              )}
              <p className="mb-1 text-muted">Quantity: {item.quantity}</p>
            </div>
            <div className="text-end">
              {/* ⭐ Logic Fix: Access item.price directly */}
              <span className="fw-bold fs-5">
                ₹{(item.price * item.quantity).toFixed(2)}
              </span>
              <p className="text-muted mb-0">(₹{item.price.toFixed(2)} each)</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetails;
