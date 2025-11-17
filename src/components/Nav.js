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
    setSearchTerm,
  } = useAppContext();

  // State to manage the text currently in the search input field
  const [searchTerm, setSearchTermLocal] = useState("");

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
    if (window.location.pathname !== "/products") {
      navigate(`/products`);
    }

    setSearchTermLocal(""); // Clear the input field after searching
  };

  return (
    // Reverting to py-0 to maintain default height, but you can adjust this.
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow ">
      {/* Container is still px-0 to keep the background full width */}
      <div className="container-fluid px-0">
        {/* Keeping px-3 for horizontal padding on the brand link */}
        <a className="navbar-brand px-3" href="/">
          <i className="bi bi-shop me-2"></i> E-Commerce Store
        </a>

        {/* Search Bar */}
        {/* Keeping px-3 for padding around the search bar when it's visible */}
        <form
          className="d-flex me-4 d-none d-md-flex px-3"
          onSubmit={handleSearchSubmit}
        >
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search products..."
            aria-label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTermLocal(e.target.value)}
          />
          <button className="btn btn-outline-light" type="submit">
            <i className="bi bi-search"></i>
          </button>
        </form>

        {/* Navbar Toggler Button */}
        {/* Keeping me-3 (margin-end) to push it slightly from the right edge */}
        <button
          className="navbar-toggler me-3"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Menu */}
        {/* Reverting px-3 here to rely on the mx-2 on the list items */}
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            {/* ✅ ADDED: mx-2 to add horizontal margin between elements */}
            <li className="nav-item mx-4">
              <a className="nav-link" href="/">
                Home
              </a>
            </li>
            {/* ✅ ADDED: mx-2 */}
            <li className="nav-item mx-4">
              <a className="nav-link" href="/products">
                Products
              </a>
            </li>
            {/* Wishlist Link with Count */}
            {/* ✅ ADDED: mx-2 */}
            <li className="nav-item mx-4">
              <a className="nav-link position-relative" href="/wishlist">
                <i className="bi bi-heart me-1"></i> Wishlist
                <span className="position-absolute top-1 start-100 translate-middle badge rounded-pill bg-info">
                  {wishlistCount > 0 ? wishlistCount : ""}
                </span>
              </a>
            </li>
            {/* Cart Link with Count */}
            {/* ✅ ADDED: mx-2 */}
            <li className="nav-item mx-4">
              <a className="nav-link position-relative" href="/cart">
                <i className="bi bi-heart me-1"></i> Cart
                <span className="position-absolute top-1 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartItemCount > 0 ? cartItemCount : ""}
                  <span className="visually-hidden">items in cart</span>
                </span>
              </a>
            </li>
            {/* ✅ ADDED: mx-2 */}
            <li className="nav-item mx-4">
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





