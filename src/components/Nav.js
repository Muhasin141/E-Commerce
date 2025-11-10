import React, { useState } from "react";
// Import useNavigate to redirect to the /products page after a search
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

const Navbar = () => {
  // Initialize navigate hook
  const navigate = useNavigate();

  // Use the custom hook to access global state and functions
  const {
    state: { cart, wishlist },
    setSearchTerm, // 👈 NEW: Get the setter function from AppContext
  } = useAppContext();

  // State to manage the text currently in the search input field
  const [searchTerm, setSearchTermLocal] = useState(""); // Renamed local state for clarity

  // Calculate the total number of items in the cart
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  // Get the number of unique items in the wishlist
  const wishlistCount = wishlist.length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    // 💥 FIX 1: Update the global search term in the context
    if (setSearchTerm) {
      setSearchTerm(searchTerm.trim());
    }

    // 💥 FIX 2: Navigate to the products page, but without the ?q parameter.
    // This ensures the user sees the filtered results, even if they started searching on Home.
    if (window.location.pathname !== "/products") {
      navigate(`/products`);
    }

    setSearchTermLocal(""); // Clear the input field after searching
  };

  return (
    // Use fixed-top to keep it visible at the top
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <i className="bi bi-shop me-2"></i> E-Commerce Store
        </a>
        {/* Search Bar */}
        <form
          className="d-flex me-4 d-none d-md-flex"
          onSubmit={handleSearchSubmit}
        >
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search products..."
            aria-label="Search"
            value={searchTerm} // Use local state
            onChange={(e) => setSearchTermLocal(e.target.value)}
          />
          <button className="btn btn-outline-light" type="submit">
            <i className="bi bi-search"></i>
          </button>
        </form>
        {/* ... (rest of the navbar component) ... */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="/">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/products">
                Products
              </a>
            </li>
            {/* Wishlist Link with Count */}
            <li className="nav-item">
              <a className="nav-link position-relative" href="/wishlist">
                <i className="bi bi-heart me-1"></i> Wishlist
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-info">
                  {wishlistCount > 0 ? wishlistCount : ""}
                </span>
              </a>
            </li>
            {/* Cart Link with Count */}
            <li className="nav-item">
              <a className="nav-link position-relative" href="/cart">
                <i className="bi bi-heart me-1"></i> Cart
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartItemCount > 0 ? cartItemCount : ""}
                  <span className="visually-hidden">items in cart</span>
                </span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/profile">
                <i className="bi bi-person-circle me-1"></i> Profile
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
