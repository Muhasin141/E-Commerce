import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext"; // Adjust path as necessary for your AppContext

// ⚠️ IMPORTANT: Replace with your actual backend URL if different
const API_URL = "https://e-commerce-app-blush-three.vercel.app/api";

// -------------------------------------------------------------------
// UserProfile Component (Main - Integrated Address Management)
// -------------------------------------------------------------------

const UserProfile = () => {
  // Consume context for user details, addresses, orders, and management functions
  const {
    state: { userDetails, orders, loading }, // Access userDetails which now contains addresses
    updateAddresses, // Context function for ADD, UPDATE, DELETE addresses
    addAlert, // To show alerts
    // Assuming fetchOrders is exposed by your AppContext for re-fetching order history
    fetchOrders,
  } = useAppContext();

  const [currentSection, setCurrentSection] = useState("profile");

  // State for Address Management Modals
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null); // Address object being edited
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);
  const [addressToDeleteId, setAddressToDeleteId] = useState(null);
  const [addressFormError, setAddressFormError] = useState(null);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // Derived state for addresses from userDetails
  const addresses = userDetails?.addresses || [];

  // --- Address Form State & Handlers (for both Add and Edit) ---
  const initialAddressFormState = {
    fullName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "", // ✅ FIX 1: Changed 'zip' to 'zipCode' to match Mongoose Schema
    phone: "",
    isDefault: false,
  };
  const [addressFormData, setAddressFormData] = useState(
    initialAddressFormState
  );

  // Effect to populate form data when editing an address
  useEffect(() => {
    if (editingAddress) {
      setAddressFormData({
        fullName: editingAddress.fullName || "",
        street: editingAddress.street || "",
        city: editingAddress.city || "",
        state: editingAddress.state || "",
        zipCode: editingAddress.zipCode || "", // ✅ FIX 2: Changed 'zip' to 'zipCode' for editing
        phone: editingAddress.phone || "",
        isDefault: editingAddress.isDefault || false,
      });
    } else {
      setAddressFormData(initialAddressFormState);
    }
    setAddressFormError(null); // Clear errors when modal opens/changes
  }, [editingAddress]);

  const handleAddressFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setAddressFormError(null);
    setIsSavingAddress(true);

    const isEdit = !!editingAddress;
    const action = isEdit ? "UPDATE" : "ADD";
    const addressId = editingAddress ? editingAddress._id : null; // Use _id from backend

    try {
      // Call the context function to perform CRUD operation
      await updateAddresses(action, addressId, addressFormData);

      addAlert(
        `Address ${isEdit ? "updated" : "added"} successfully!`,
        "success"
      );
      setIsAddAddressModalOpen(false);
      setEditingAddress(null);
      setAddressFormData(initialAddressFormState); // Reset form
    } catch (err) {
      console.error(`Error saving address (${action}):`, err);
      setAddressFormError(
        err.message || `Failed to ${action.toLowerCase()} address.`
      );
    } finally {
      setIsSavingAddress(false);
    }
  };

  // --- Delete Confirmation Handlers ---
  const openDeleteConfirmModal = (addressId) => {
    const isDefault = addresses.find((a) => a._id === addressId)?.isDefault;
    if (isDefault) {
      addAlert(
        "Cannot delete default address. Please set another address as default first.",
        "danger"
      );
      return;
    }
    setAddressToDeleteId(addressId);
    setIsDeleteConfirmModalOpen(true);
  };

  const closeDeleteConfirmModal = () => {
    setIsDeleteConfirmModalOpen(false);
    setAddressToDeleteId(null);
  };

  const confirmDeleteAddress = async () => {
    if (addressToDeleteId) {
      try {
        // Call the context function to perform the DELETE operation
        await updateAddresses("DELETE", addressToDeleteId);
        addAlert("Address deleted successfully!", "warning");
      } catch (err) {
        console.error("Error deleting address:", err);
        addAlert(err.message || "Failed to delete address.", "danger");
      } finally {
        closeDeleteConfirmModal();
      }
    }
  };

  // --- Render Section Logic ---
  const renderSection = () => {
    switch (currentSection) {
      case "addresses":
        return (
          <AddressManager
            addresses={addresses} // Use derived addresses from userDetails
            onOpenAddModal={() => {
              setEditingAddress(null);
              setIsAddAddressModalOpen(true);
            }}
            onOpenEditModal={(addr) => setEditingAddress(addr)}
            onOpenDeleteConfirmModal={openDeleteConfirmModal}
          />
        );
      case "orders":
        return (
          <OrderHistory
            orders={orders || []}
            loading={loading} // Orders loading from useAppContext state
            error={null} // AppContext handles alerts globally for order errors
            refetchOrders={fetchOrders} // Assuming AppContext exposes this
          />
        );
      case "profile":
      default:
        return (
          <StaticDetails
            userDetails={userDetails}
            loading={loading} // User details loading from useAppContext state
          />
        );
    }
  };

  // Main loading screen for initial user/profile data
  if (loading && !userDetails) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <LoadingSpinner />
        <span className="ms-2">Loading Profile...</span>
      </div>
    );
  }
  // If userDetails is still null after loading (e.g., not logged in or error)
  if (!userDetails) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i> Failed to
          load user profile. Please ensure you are logged in.
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossOrigin="anonymous"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
        rel="stylesheet"
      />

      <div className="container py-5">
        <h1 className="mb-4 pb-2 border-bottom fw-bold text-dark">
          My Account Dashboard
        </h1>

        <div className="row g-4">
          {/* --- Left Column: Navigation (Responsive Sidebar) --- */}
          <div className="col-lg-3 col-md-4">
            <div className="list-group shadow-lg rounded-3 overflow-hidden border-0">
              <button
                className={`list-group-item list-group-item-action d-flex align-items-center ${
                  currentSection === "profile"
                    ? "active bg-primary border-primary"
                    : "text-dark"
                }`}
                onClick={() => setCurrentSection("profile")}
              >
                <i className="bi bi-person-circle me-3 fs-5"></i> Account
                Details
              </button>
              <button
                className={`list-group-item list-group-item-action d-flex align-items-center ${
                  currentSection === "addresses"
                    ? "active bg-primary border-primary"
                    : "text-dark"
                }`}
                onClick={() => setCurrentSection("addresses")}
              >
                <i className="bi bi-geo-alt-fill me-3 fs-5"></i> Address
                Management
              </button>
              <button
                className={`list-group-item list-group-item-action d-flex align-items-center ${
                  currentSection === "orders"
                    ? "active bg-primary border-primary"
                    : "text-dark"
                }`}
                onClick={() => setCurrentSection("orders")}
              >
                <i className="bi bi-box-seam-fill me-3 fs-5"></i> Order History
              </button>
              {/* Removed Logout Button */}
            </div>
          </div>

          {/* --- Right Column: Content Area --- */}
          <div className="col-lg-9 col-md-8">
            <div className="card shadow-lg p-4 p-md-5 bg-white rounded-3 border-0 min-vh-75">
              {renderSection()}
            </div>
          </div>
        </div>
      </div>
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossOrigin="anonymous"
      ></script>

      {/* --- ADD/EDIT Address Modal --- */}
      {(isAddAddressModalOpen || editingAddress) && (
        <div
          className={`modal fade ${
            isAddAddressModalOpen || editingAddress ? "show d-block" : ""
          }`}
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => {
                    setIsAddAddressModalOpen(false);
                    setEditingAddress(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                {addressFormError && (
                  <div className="alert alert-danger" role="alert">
                    {addressFormError}
                  </div>
                )}
                <form onSubmit={handleSaveAddress}>
                  <div className="mb-3">
                    <label htmlFor="fullName" className="form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="fullName"
                      name="fullName"
                      value={addressFormData.fullName}
                      onChange={handleAddressFormChange}
                      required
                      disabled={isSavingAddress}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="street" className="form-label">
                      Street Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="street"
                      name="street"
                      value={addressFormData.street}
                      onChange={handleAddressFormChange}
                      required
                      disabled={isSavingAddress}
                    />
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="city" className="form-label">
                        City
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="city"
                        name="city"
                        value={addressFormData.city}
                        onChange={handleAddressFormChange}
                        required
                        disabled={isSavingAddress}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="state" className="form-label">
                        State/Province
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="state"
                        name="state"
                        value={addressFormData.state}
                        onChange={handleAddressFormChange}
                        required
                        disabled={isSavingAddress}
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="zipCode" className="form-label">
                        Zip/Postal Code
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="zipCode" // ✅ FIX 3: Changed 'zip' to 'zipCode'
                        name="zipCode" // ✅ FIX 4: Changed 'zip' to 'zipCode'
                        value={addressFormData.zipCode} // ✅ FIX 5: Uses correct state key
                        onChange={handleAddressFormChange}
                        required
                        disabled={isSavingAddress}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="phone" className="form-label">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={addressFormData.phone}
                        onChange={handleAddressFormChange}
                        required
                        disabled={isSavingAddress}
                      />
                    </div>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isDefault"
                      name="isDefault"
                      checked={addressFormData.isDefault}
                      onChange={handleAddressFormChange}
                      disabled={isSavingAddress}
                    />
                    <label className="form-check-label" htmlFor="isDefault">
                      Set as default address
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={isSavingAddress}
                  >
                    {isSavingAddress ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Saving...
                      </>
                    ) : editingAddress ? (
                      "Save Changes"
                    ) : (
                      "Add Address"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Delete Confirmation Modal --- */}
      <ConfirmationModal
        isOpen={isDeleteConfirmModalOpen}
        title="Confirm Delete Address"
        message="Are you sure you want to delete this address? This action cannot be undone."
        onConfirm={confirmDeleteAddress}
        onCancel={closeDeleteConfirmModal}
      />
    </div>
  );
};

// --- Helper Components ---

const LoadingSpinner = () => (
  <div className="spinner-border text-primary" role="status">
    <span className="visually-hidden">Loading...</span>
  </div>
);

/**
 * Displays static user details.
 */
const StaticDetails = ({ userDetails, loading }) => (
  <>
    <h3 className="pb-3 mb-4 border-bottom fw-bold text-dark">
      Account Details
    </h3>
    {loading ? (
      <LoadingSpinner />
    ) : !userDetails ? (
      <div className="alert alert-warning" role="alert">
        User details not available.
      </div>
    ) : (
      <ul className="list-group list-group-flush border rounded-3 overflow-hidden shadow-sm">
        <li className="list-group-item d-flex justify-content-between align-items-center p-3">
          <span className="fw-semibold text-secondary">Name:</span>
          <span className="text-dark fw-medium">
            {userDetails?.name || "N/A"}
          </span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center p-3">
          <span className="fw-semibold text-secondary">Email ID:</span>
          <span className="text-dark fw-medium">
            {userDetails?.email || "N/A"}
          </span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center p-3">
          <span className="fw-semibold text-secondary">Phone Number:</span>
          <span className="text-dark fw-medium">
            {userDetails?.phone || "43738939"}
          </span>
        </li>
      </ul>
    )}{" "}
    {/* Removed Edit Profile Button */}
  </>
);

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-3 shadow-lg">
          <div className="modal-header bg-danger text-white rounded-top-3">
            <h5 className="modal-title fw-bold">{title}</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onCancel}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p className="text-dark">{message}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button className="btn btn-danger fw-bold" onClick={onConfirm}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------
// AddressManager Component (Interacts with UserProfile's state/handlers)
// -------------------------------------------------------------------
const AddressManager = ({
  addresses,
  onOpenAddModal,
  onOpenEditModal,
  onOpenDeleteConfirmModal,
}) => {
  // Use useAppContext here if you need to call updateAddresses directly for Set Default
  const { updateAddresses, addAlert } = useAppContext();

  const handleSetDefault = async (addr) => {
    try {
      const data = { ...addr, isDefault: true }; // New data: set isDefault to true
      // Call updateAddresses with UPDATE action
      await updateAddresses("UPDATE", addr._id, data);
      addAlert("Default address updated successfully!", "success");
    } catch (error) {
      console.error("Error setting default address:", error);
      addAlert(`Failed to set default address. (${error.message})`, "danger");
    }
  };

  return (
    <>
      <h3 className="pb-3 mb-4 border-bottom fw-bold text-dark">
        Address Management
      </h3>

      <button
        className="btn btn-success mb-4 d-flex align-items-center fw-bold shadow-sm"
        onClick={onOpenAddModal}
      >
        <i className="bi bi-plus-circle me-2"></i> Add New Address
      </button>

      {addresses.length === 0 ? (
        <div className="alert alert-info" role="alert">
          You have no saved addresses. Click "Add New Address" above.
        </div>
      ) : (
        <div className="row g-4">
          {addresses.map((addr) => (
            <div key={addr._id} className="col-lg-6 col-md-12">
              <div
                className={`card h-100 d-flex flex-column rounded-3 shadow-lg ${
                  addr.isDefault ? "border-4 border-primary bg-light" : "border"
                }`}
              >
                <div className="card-body d-flex flex-column flex-grow-1 p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title fw-bold text-dark mb-0">
                      {addr.fullName}
                    </h5>
                    {addr.isDefault && (
                      <span className="badge bg-primary text-white p-2 rounded-pill fw-normal">
                        DEFAULT
                      </span>
                    )}
                  </div>
                  {/* Displaying individual address fields */}
                  <p className="card-text text-secondary mb-1">{addr.street}</p>
                  <p className="card-text text-secondary mb-1">
                    {addr.city}, {addr.state} {addr.zipCode}{" "}
                    {/* NOTE: This assumes backend returns 'zipCode' when fetching addresses. If it returns 'zip', this line needs a different fix. */}
                  </p>
                  <p className="card-text text-secondary mb-3">{addr.phone}</p>
                </div>
                <div className="card-footer bg-light d-flex justify-content-between align-items-center p-3 rounded-bottom-3">
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-sm btn-outline-secondary d-flex align-items-center me-2"
                      onClick={() => onOpenEditModal(addr)}
                    >
                      <i className="bi bi-pencil-fill me-1"></i> Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger d-flex align-items-center"
                      onClick={() => onOpenDeleteConfirmModal(addr._id)}
                      disabled={addr.isDefault}
                    >
                      <i className="bi bi-trash-fill me-1"></i> Delete
                    </button>
                  </div>
                  {/* Set as Default Button */}
                  {!addr.isDefault && (
                    <button
                      className="btn btn-sm btn-success fw-medium shadow-sm"
                      onClick={() => handleSetDefault(addr)}
                    >
                      Set Default
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

// -------------------------------------------------------------------
// OrderHistory Component (No Change, just uses orders from context)
// -------------------------------------------------------------------

const OrderHistory = ({ orders, loading, error, refetchOrders }) => {
  // Utility to determine status display style
  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return {
          class: "bg-success-subtle text-success",
          icon: "bi-check-circle-fill",
        };
      case "Shipped":
        return { class: "bg-info-subtle text-info", icon: "bi-truck" };
      case "Canceled":
        return {
          class: "bg-danger-subtle text-danger",
          icon: "bi-x-octagon-fill",
        };
      case "Processing":
      default:
        return {
          class: "bg-warning-subtle text-warning",
          icon: "bi-clock-fill",
        };
    }
  };

  // --- Render Logic ---
  return (
    <>
      <h3 className="pb-3 mb-4 border-bottom fw-bold text-dark d-flex justify-content-between align-items-center">
        Order History
        <button
          className="btn btn-sm btn-outline-secondary d-flex align-items-center"
          onClick={refetchOrders} // Calls refetchOrders from AppContext
          disabled={loading}
          title="Refresh Orders"
        >
          <i
            className={`bi bi-arrow-clockwise me-1 ${
              loading ? "spinner-border spinner-border-sm" : ""
            }`}
          ></i>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </h3>

      {error && ( // Display error if passed, though AppContext's addAlert is preferred
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i> Error loading
          orders: {error}
        </div>
      )}

      {loading && !orders.length ? (
        <div className="d-flex justify-content-center py-5">
          <LoadingSpinner />
        </div>
      ) : orders.length === 0 ? (
        <div className="alert alert-info" role="alert">
          You have not placed any orders yet.
        </div>
      ) : (
        orders.map((order) => {
          const statusData = getStatusStyle(
            order.orderStatus || order.status || "Processing"
          );
          const displayId =
            order.orderId || (order._id ? order._id.slice(-8) : "N/A");
          const displayDate = new Date(
            order.createdAt || order.date
          ).toLocaleDateString();
          const total = order.totalAmount || 0;

          return (
            <div
              key={order._id || order.id}
              className="card mb-4 shadow-sm border rounded-3 overflow-hidden"
            >
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start flex-wrap">
                  <div className="flex-grow-1 me-3 mb-2 mb-sm-0">
                    <h6 className="mb-1 fs-5 fw-bold text-dark">
                      Order{" "}
                      <span className="font-monospace text-primary">
                        #{displayId}
                      </span>
                    </h6>
                    <small className="text-secondary">
                      Placed on {displayDate}
                    </small>
                  </div>
                  <div className="d-flex align-items-center space-x-4">
                    <span
                      className={`badge rounded-pill p-2 fw-semibold ${statusData.class}`}
                    >
                      <i className={`bi ${statusData.icon} me-1`}></i>
                      {order.orderStatus || order.status || "Processing"}
                    </span>
                    <span className="fw-bolder fs-4 text-dark ms-2">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
                <hr className="my-3" />
                <Link
                  to={`/order/${order._id || order.id}`}
                  className="btn btn-outline-secondary btn-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          );
        })
      )}
    </>
  );
};

export default UserProfile;
