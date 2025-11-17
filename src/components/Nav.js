import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    state: { cart, wishlist },
    searchTerm: globalSearchTerm,
    setSearchTerm,
  } = useAppContext();

  // Local input state synced with global state
  const [searchTermLocal, setSearchTermLocal] = useState(
    globalSearchTerm || ""
  );

  // Sync local search term when global term changes (important after navigating)
  useEffect(() => {
    setSearchTermLocal(globalSearchTerm || "");
  }, [globalSearchTerm]);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    // Update global search term
    setSearchTerm(searchTermLocal.trim());

    // Navigate to products page if not already there
    if (location.pathname !== "/products") {
      navigate("/products");
    }
  };

  const clearSearch = () => {
    setSearchTermLocal("");
    setSearchTerm("");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow pt-3">
      <div className="container-fluid px-0">
        {/* Brand */}
        <Link className="navbar-brand px-3" to="/">
          <i className="bi bi-shop me-2"></i> E-Commerce Store
        </Link>

        {/* Desktop Search Bar */}
        <form
          className="d-none d-md-flex me-4 px-3"
          onSubmit={handleSearchSubmit}
        >
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search products..."
            value={searchTermLocal}
            onChange={(e) => setSearchTermLocal(e.target.value)}
          />
          <button className="btn btn-outline-light me-2" type="submit">
            Search
          </button>
          <button
            className="btn btn-outline-light"
            type="button"
            onClick={clearSearch}
          >
            Clear
          </button>
        </form>

        {/* Navbar Toggler Button */}
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

        {/* Mobile Menu */}
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            {/* Mobile Search Bar */}
            <li className="nav-item d-md-none px-3 mb-2 mt-2">
              <form onSubmit={handleSearchSubmit} className="d-flex">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search products..."
                  value={searchTermLocal}
                  onChange={(e) => setSearchTermLocal(e.target.value)}
                />
                <button className="btn btn-outline-light me-2" type="submit">
                  Search
                </button>
                <button
                  className="btn btn-outline-light"
                  type="button"
                  onClick={clearSearch}
                >
                  Clear
                </button>
              </form>
            </li>

            <li className="nav-item mx-4">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item mx-4">
              <Link className="nav-link" to="/products">
                Products
              </Link>
            </li>

            <li className="nav-item mx-4">
              <Link className="nav-link position-relative" to="/wishlist">
                <i className="bi bi-heart me-1"></i> Wishlist
                <span className="badge bg-info position-absolute top-0 start-100 translate-middle">
                  {wishlistCount}
                </span>
              </Link>
            </li>

            <li className="nav-item mx-4">
              <Link className="nav-link position-relative" to="/cart">
                <i className="bi bi-cart me-1"></i> Cart
                <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                  {cartItemCount}
                </span>
              </Link>
            </li>

            <li className="nav-item mx-4">
              <Link className="nav-link" to="/profile">
                <i className="bi bi-person-circle me-1"></i> Profile
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;






